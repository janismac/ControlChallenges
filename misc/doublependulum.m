clc
clear
syms x dx ddx m0 real
syms x1 dx1 ddx1 y1 dy1 ddy1 theta1 dtheta1 ddtheta1 T1 m1 L1 real
syms x2 dx2 ddx2 y2 dy2 ddy2 theta2 dtheta2 ddtheta2 T2 m2 L2 real
syms g real
syms u real

%% Nonlinear mechanics equations (every row must equal zero)

% Kinetics (F=ma)
F=[m0*ddx-(T1*sin(theta1)+u);
m1*ddx1-(-T1*sin(theta1)+T2*sin(theta2));
m2*ddx2-(-T2*sin(theta2));
m1*ddy1-(-m1*g-T1*cos(theta1)+T2*cos(theta2));
m2*ddy2-(-m2*g-T2*cos(theta2));
% Kinematics
-L1*(ddtheta1*cos(theta1)-sin(theta1)*dtheta1.^2)-(-ddx1+ddx);
-L2*(ddtheta2*cos(theta2)-sin(theta2)*dtheta2.^2)-(-ddx2+ddx1);
L1*(cos(theta1)*dtheta1.^2+sin(theta1)*ddtheta1)-(-ddy1);
L2*(cos(theta2)*dtheta2.^2+sin(theta2)*ddtheta2)-(-ddy2+ddy1);
];

%% Values for the parameters
F=subs(F,m0, 10);
F=subs(F,m1, 2);
F=subs(F,m2, 4);
F=subs(F,L1, 0.618);
F=subs(F,L2, 1);
F=subs(F, g, 2);

X = [x,dx,theta1,dtheta1,theta2,dtheta2,u]'; % state variables + ctrl variable
Y = [ddx,ddtheta1,ddtheta2,ddx1,ddx2,ddy1,ddy2,T1,T2]'; % state derivatives + rod tensions

%% linearize and substitute balance point
F0 = F;
X0 = zeros(7,1);
F0 = subs(F0,X,X0);
Y0 = solve(F0 == zeros(9,1),Y);
Y0 = arrayfun(@(i) double(Y0.(char(Y(i)))),1:9)'; % Extract numeric values
dFdX = jacobian(F,X);
dFdY = jacobian(F,Y);
dFdX0 = subs(subs(dFdX,X,X0),Y,Y0);
dFdY0 = subs(subs(dFdY,X,X0),Y,Y0);
dYdX0 = -double(dFdY0\dFdX0); % Application of implicit function theorem

%% state space model
A = zeros(6,6); % state space variable: [x,dx,theta1,dtheta1,theta2,dtheta2]
A(1,2) = 1;
A(2,:) = dYdX0(1,1:6);
A(3,4) = 1;
A(4,:) = dYdX0(2,1:6);
A(5,6) = 1;
A(6,:) = dYdX0(3,1:6);

B = zeros(6,1);
B(2) = dYdX0(1,7);
B(4) = dYdX0(2,7);
B(6) = dYdX0(3,7);

%% Linear-quadratic regulator
Q = eye(6);
Q(1,1)=1000; % Put high priority on minimizing x (cart position).
G = lqr(A,B,Q,1,0);
disp(['return ' strrep(char(vpa(-sum(G.*X(1:6)'),8)), '*', '*p.') ';']); % Generate controller code.