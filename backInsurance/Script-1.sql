CREATE TABLE user_details
    (    
        user_id int PRIMARY KEY AUTO_INCREMENT,
        firstname varchar(50) NOT NULL,
        lastname varchar(50) NOT NULL,
        email varchar(50) NOT NULL UNIQUE,
        password varchar(50) NOT NULL,
        user_role varchar(10) DEFAULT 'CUSTOMER',
        mobileno varchar(50) NOT NULL,
        dob date NOT NULL,
        city varchar(50) NOT NULL,
        addressline1 varchar(50) NOT NULL,
        state varchar(50) NOT NULL,
        pin varchar(50) NOT NULL
     );
    
INSERT INTO user_details values(null, 'Adam', 'Levine', 'alev@hotmail.com', 'alev_23@As', 'ADMIN', '3214987123', '1979-07-11', 'Melbourne', 'Street B-66', 'AU',  '21254');
INSERT INTO user_details values(null, 'Ennie', 'Blancs', 'blnc@hotmail.com', 'blnc_23@As', DEFAULT, '6216227625', '1988-12-5', 'Sydney', 'Corner 45', 'AU',  '12543');


CREATE TABLE policy_types
    (
        policy_type_code varchar(10) primary key,
        policy_type_name varchar(50)
    );
   
INSERT INTO policy_types values('1', 'car');
INSERT INTO policy_types values('2', 'home');
INSERT INTO policy_types values('3', 'life');
   
CREATE TABLE policy_sub_types
    (
        policy_type_id varchar(10) primary key,
        policy_type_code varchar(10) references policy_types(policy_type_code),
        description varchar(50),
        yearsofpayements int,
        amount double,
        fine double,
        maturityperiod int,
        maturityamount double,
        validity int
     );

INSERT INTO policy_sub_types values('11','1','theft',1,500,250,null,200000,1);
INSERT INTO policy_sub_types values('22','1','accident',1,2000,1000,null,200000,3);
INSERT INTO policy_sub_types values('33','2','fire',1,500,300,null,500000,3);
INSERT INTO policy_sub_types values('44','3','fireshot',5,5000,2000,5,1500000,5);
INSERT INTO policy_sub_types values('55','3','death on the job',15,5000,2000,15,300000,20);

CREATE TABLE user_policies
    (
        policy_no int PRIMARY KEY AUTO_INCREMENT,
        user_id int references user_details(user_id),
        date_registered date,
        policy_type_id varchar(10) references policy_sub_types(policy_type_id),
        status varchar(10) DEFAULT 'inactive'
    );
  
ALTER TABLE user_policies ADD UNIQUE unique_uidpid(user_id, policy_type_id);
   
INSERT INTO user_policies values(null, 1,'1994-4-18','22', 'active');
INSERT INTO user_policies values(null, 1,null,'55', DEFAULT);
INSERT INTO user_policies values(null, 2,null,'11', DEFAULT);


CREATE TABLE policy_payments
    (
        receipno int PRIMARY KEY AUTO_INCREMENT,
        user_id int references user_details(user_id),
        policy_no int,
        dateofpayment date,
        amount double,
        fine double,
        status varchar(10) DEFAULT 'unpaid'
    );
    
INSERT INTO policy_payments values(null, 1, 1,'2012-4-09', 500, 250, 'paid');
INSERT INTO policy_payments values(null, 1, 2, null ,2000, 1000, DEFAULT);
INSERT INTO policy_payments values(null, 2, 3, null,500, 300, DEFAULT);

SET FOREIGN_KEY_CHECKS=0;