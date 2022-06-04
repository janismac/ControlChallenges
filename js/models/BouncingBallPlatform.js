'use strict';
if (typeof Models === 'undefined') var Models = {};

Models.BouncingBallPlatform = function(params)
{
    var nVars = Object.keys(this.vars).length;
    for(var i = 0; i < nVars; i++)
    {
        var key = Object.keys(this.vars)[i];
        this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
    }
}

Models.BouncingBallPlatform.prototype.vars = 
{
    ball_x: -2.0,
    ball_y: -1.1,
    ball_dx: 1.5,
    ball_dy: 0.01,
    ball_radius: 0.2,
    platform_base_y: -5.0,
    piston_length: 2.0,
    piston_speed: 0.0,
    piston_length_min: 1.5,
    piston_length_max: 2.3,
    paddle_half_width: 1.5,
    paddle_thickness: 0.15,
    hinge_angle: 0.05,
    hinge_angular_speed: 0.0,
    hinge_angle_max: 0.7,
    g: 9.81,
    T: 0,
    contact_point_rel_x: 0,
    contact_distance: 10,
    edge_balance_win_condition_counter: 0,
    bounce_win_condition_counter: 0,
    show_zero_cross: false,
};


Models.BouncingBallPlatform.prototype.simulate = function (dt, controlFunc)
{
    var copy = new Models.BouncingBallPlatform(this);

    var commands = controlFunc(
        {
            x:this.ball_x,
            y:this.ball_y,
            vx:this.ball_dx,
            vy:this.ball_dy,
        },
        {
            length:this.piston_length,
            speed:this.piston_speed,
        },
        {
            angle:this.hinge_angle,
            speed:this.hinge_angular_speed,
        },
        this.T
    ); 
    if(typeof commands != 'object' || typeof commands.pistonAcceleration != 'number' || typeof commands.hingeAcceleration != 'number') 
        throw "Error: The controlFunction must return an object: {pistonAcceleration:number, hingeAcceleration:number}";

    commands.pistonAcceleration = Math.max(-10.0, Math.min(10.0, commands.pistonAcceleration)); // input limits
    commands.hingeAcceleration = Math.max(-15.0, Math.min(15.0, commands.hingeAcceleration)); // input limits


    var n_substeps = 5;
    for (var i = 0; i < n_substeps; i++)
    {
        copy = copy.simulate_substep(dt/n_substeps, commands);
    }
    return copy;
}

Models.BouncingBallPlatform.prototype.simulate_substep = function (dt, commands)
{
    var copy = new Models.BouncingBallPlatform(this);
    
    copy.ball_x += dt * copy.ball_dx;
    copy.ball_y += dt * copy.ball_dy + (0.5*dt*dt)*(-copy.g);
    copy.ball_dy -= dt * copy.g;

    if(copy.ball_y - copy.ball_radius < copy.platform_base_y) copy.ball_dy = Math.abs(copy.ball_dy);

    copy.hinge_angular_speed += dt * commands.hingeAcceleration;
    copy.hinge_angle += dt * copy.hinge_angular_speed;

    copy.piston_speed += dt * commands.pistonAcceleration;
    copy.piston_length += dt * copy.piston_speed;

    if(copy.piston_length > copy.piston_length_max)
    {
        copy.piston_length = copy.piston_length_max;
        copy.piston_speed = Math.min(0.0, copy.piston_speed);
    }

    if(copy.piston_length < copy.piston_length_min)
    {
        copy.piston_length = copy.piston_length_min;
        copy.piston_speed = Math.max(0.0, copy.piston_speed);
    }

    if(copy.hinge_angle > copy.hinge_angle_max)
    {
        copy.hinge_angle = copy.hinge_angle_max;
        copy.hinge_angular_speed = Math.min(0.0, copy.hinge_angular_speed);
    }

    if(copy.hinge_angle < -copy.hinge_angle_max)
    {
        copy.hinge_angle = -copy.hinge_angle_max;
        copy.hinge_angular_speed = Math.max(0.0, copy.hinge_angular_speed);
    }

    // Collision calculations
    var C = Math.cos(copy.hinge_angle);
    var S = Math.sin(copy.hinge_angle);

    var dC_dt = -Math.sin(copy.hinge_angle) * copy.hinge_angular_speed;
    var dS_dt =  Math.cos(copy.hinge_angle) * copy.hinge_angular_speed;

    var paddle_center_x =                                           - S * copy.paddle_thickness;
    var paddle_center_y = copy.platform_base_y + copy.piston_length + C * copy.paddle_thickness;

    var paddle_center_velocity_x =                   - dS_dt * copy.paddle_thickness;
    var paddle_center_velocity_y = copy.piston_speed + dC_dt * copy.paddle_thickness;

    var ball_rel_x =  C * (copy.ball_x - paddle_center_x) + S * (copy.ball_y - paddle_center_y);
    var ball_rel_y = -S * (copy.ball_x - paddle_center_x) + C * (copy.ball_y - paddle_center_y);

    var contact_point_rel_x = Math.max(-copy.paddle_half_width, Math.min(copy.paddle_half_width, ball_rel_x));
    copy.contact_point_rel_x = contact_point_rel_x;

    var contact_point_x = paddle_center_x + C * contact_point_rel_x;
    var contact_point_y = paddle_center_y + S * contact_point_rel_x;

    var contact_point_velocity_x = paddle_center_velocity_x + dC_dt * contact_point_rel_x;
    var contact_point_velocity_y = paddle_center_velocity_y + dS_dt * contact_point_rel_x;

    var contact_normal_x = copy.ball_x - contact_point_x;
    var contact_normal_y = copy.ball_y - contact_point_y;

    var contact_distance = Math.sqrt(contact_normal_x*contact_normal_x + contact_normal_y*contact_normal_y);
    copy.contact_distance = contact_distance;
    contact_normal_x /= contact_distance;
    contact_normal_y /= contact_distance;

    var ball_delta_velocity_x = copy.ball_dx - contact_point_velocity_x;
    var ball_delta_velocity_y = copy.ball_dy - contact_point_velocity_y;

    var ball_delta_velocity_normal = contact_normal_x * ball_delta_velocity_x + contact_normal_y * ball_delta_velocity_y;

    ball_delta_velocity_x += contact_normal_x * (-1.9 * ball_delta_velocity_normal);
    ball_delta_velocity_y += contact_normal_y * (-1.9 * ball_delta_velocity_normal);

    if(ball_delta_velocity_normal < 0 && contact_distance < copy.ball_radius)
    {
        copy.ball_dx = ball_delta_velocity_x + contact_point_velocity_x;
        copy.ball_dy = ball_delta_velocity_y + contact_point_velocity_y;

        copy.ball_x = contact_point_x + contact_normal_x * copy.ball_radius;
        copy.ball_y = contact_point_y + contact_normal_y * copy.ball_radius;
    }

    // Balance level win condition
    if(
        (contact_distance < 2 * copy.ball_radius) &&
        (Math.abs(contact_point_rel_x + copy.paddle_half_width) < 0.05) &&
        (Math.abs(copy.ball_dx) < 0.01) &&
        (Math.abs(copy.ball_dy) < 0.5) &&
        (Math.abs(copy.hinge_angular_speed) < 0.01) &&
        (Math.abs(copy.piston_speed) < 0.01) &&
        (copy.hinge_angle < -0.02)
    )
    {
        copy.edge_balance_win_condition_counter += 1;
    }
    else
    {
        copy.edge_balance_win_condition_counter = 0;
    }


    // Bounce level win condition
    var apogee = copy.ball_y + copy.ball_dy*copy.ball_dy / (2 * copy.g);
    if(
        (Math.abs(apogee) < 0.01) &&
        (Math.abs(copy.ball_dx) < 0.01) &&
        (Math.abs(copy.ball_x) < 0.01)
    )
    {
        copy.bounce_win_condition_counter += 1;
    }
    else
    {
        copy.bounce_win_condition_counter = 0;
    }


    copy.T = copy.T + dt; // count time

    return copy;    
}


Models.BouncingBallPlatform.prototype.draw = function (ctx, canvas)
{
    resetCanvas(ctx,canvas);
    ctx.scale(0.7,0.7);


    if(this.show_zero_cross)
    {
        ctx.strokeStyle="#333366";
        drawLine(ctx,0.1,0.1,-0.1,-0.1,0.05);
        drawLine(ctx,0.1,-0.1,-0.1,0.1,0.05);
    }


    // Piston and cylinder
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(-0.1, this.platform_base_y, 0.2, this.piston_length);
    ctx.fillStyle = '#555555';
    ctx.fillRect(-0.2, this.platform_base_y, 0.4, this.piston_length_min - 0.2);

    // Floor
    ctx.strokeStyle="#222222";
    drawLine(ctx,-1,this.platform_base_y,1,this.platform_base_y,1/40.0);

    ctx.save();
    ctx.translate(0,this.platform_base_y);
    ctx.translate(0,this.piston_length);
    ctx.rotate(this.hinge_angle);

    // Paddle
    ctx.fillStyle = '#0000aa';
    ctx.fillRect(-this.paddle_half_width, 0.0, 2*this.paddle_half_width, this.paddle_thickness);

    // Hinge
    ctx.beginPath();
    ctx.arc(0, 0, 0.12, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 0.09, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.restore();


    // Ball
    ctx.beginPath();
    ctx.arc(this.ball_x, this.ball_y, this.ball_radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#4444FF';
    ctx.fill();


    /*

    // Collision debugging graphics

    var C = Math.cos(this.hinge_angle);
    var S = Math.sin(this.hinge_angle);

    var dC_dt = -Math.sin(this.hinge_angle) * this.hinge_angular_speed;
    var dS_dt =  Math.cos(this.hinge_angle) * this.hinge_angular_speed;

    var paddle_center_x =                                           - S * this.paddle_thickness;
    var paddle_center_y = this.platform_base_y + this.piston_length + C * this.paddle_thickness;

    var paddle_center_velocity_x =                   - dS_dt * this.paddle_thickness;
    var paddle_center_velocity_y = this.piston_speed + dC_dt * this.paddle_thickness;

    var ball_rel_x =  C * (this.ball_x - paddle_center_x) + S * (this.ball_y - paddle_center_y);
    var ball_rel_y = -S * (this.ball_x - paddle_center_x) + C * (this.ball_y - paddle_center_y);

    var contact_point_rel_x = Math.max(-this.paddle_half_width, Math.min(this.paddle_half_width, ball_rel_x));

    var contact_point_x = paddle_center_x + C * contact_point_rel_x;
    var contact_point_y = paddle_center_y + S * contact_point_rel_x;

    var contact_point_velocity_x = paddle_center_velocity_x + dC_dt * contact_point_rel_x;
    var contact_point_velocity_y = paddle_center_velocity_y + dS_dt * contact_point_rel_x;

    var contact_normal_x = this.ball_x - contact_point_x;
    var contact_normal_y = this.ball_y - contact_point_y;

    var contact_distance = Math.sqrt(contact_normal_x*contact_normal_x + contact_normal_y*contact_normal_y);
    contact_normal_x /= contact_distance;
    contact_normal_y /= contact_distance;

    var ball_delta_velocity_x = this.ball_dx - contact_point_velocity_x;
    var ball_delta_velocity_y = this.ball_dy - contact_point_velocity_y;

    var ball_delta_velocity_normal = contact_normal_x * ball_delta_velocity_x + contact_normal_y * ball_delta_velocity_y;

    ball_delta_velocity_x += contact_normal_x * (-1.9 * ball_delta_velocity_normal);
    ball_delta_velocity_y += contact_normal_y * (-1.9 * ball_delta_velocity_normal);


    var ball_dx_new = ball_delta_velocity_x + contact_point_velocity_x;
    var ball_dy_new = ball_delta_velocity_y + contact_point_velocity_y;


    ctx.strokeStyle="#ff0000";
    var X = contact_point_x;
    var Y = contact_point_y;
    drawLine(ctx,X+0.1,Y+0.1,X-0.1,Y-0.1,0.02);
    drawLine(ctx,X+0.1,Y-0.1,X-0.1,Y+0.1,0.02);



    ctx.strokeStyle="#ff00ff";
    drawLine(ctx, contact_point_x, contact_point_y, contact_point_x + contact_normal_x, contact_point_y + contact_normal_y,0.03);

    if(ball_delta_velocity_normal < 0)
    {
        ctx.strokeStyle="#00ffff";
        drawLine(ctx, contact_point_x, contact_point_y, contact_point_x + ball_dx_new, contact_point_y + ball_dy_new, 0.03);
    }*/


}


Models.BouncingBallPlatform.prototype.infoText = function ()
{
    return  "ball.x        = " + this.ball_x.toFixed(2).padStart(6,' ')
        + "\nball.vx       = " + this.ball_dx.toFixed(2).padStart(6,' ')
        + "\nball.y        = " + this.ball_y.toFixed(2).padStart(6,' ')
        + "\nball.vy       = " + this.ball_dy.toFixed(2).padStart(6,' ')
        + "\npiston.length = " + this.piston_length.toFixed(2).padStart(6,' ')
        + "\npiston.speed  = " + this.piston_speed.toFixed(2).padStart(6,' ')
        + "\nhinge.angle   = " + this.hinge_angle.toFixed(2).padStart(6,' ')
        + "\nhinge.speed   = " + this.hinge_angular_speed.toFixed(2).padStart(6,' ')
        + "\nT             = " + this.T.toFixed(2).padStart(6,' ');   
}