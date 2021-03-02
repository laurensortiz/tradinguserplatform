
-- Drop table

-- DROP TABLE public."Account";

CREATE TABLE public."Account" (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	percentage numeric(10,2) NOT NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"associatedOperation" int4 NULL,
	CONSTRAINT "Account_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Account" (id,"name",percentage,status,"createdAt","updatedAt","associatedOperation") VALUES
(2,'Classic',15.00,1,'2019-12-04 11:51:34.023','2019-12-04 11:51:34.023',1)
,(3,'Gold',10.00,1,'2019-12-04 11:51:34.023','2019-12-04 11:51:34.023',1)
,(4,'Profit Month 5%',5.00,1,'2020-01-03 18:23:24.990','2020-02-03 17:37:29.090',2)
,(6,'CME Funds 7.5%',7.50,1,'2019-12-04 11:51:34.023','2020-02-03 18:00:25.896',2)
,(0,'Admin',0.00,2,'2019-12-04 11:51:34.000','2019-12-04 11:51:34.000',NULL)
,(1,'Micro',20.00,1,'2019-12-04 11:51:34.023','2019-12-04 11:51:34.000',1)
,(7,'Funds 3.5%',3.50,1,'2020-03-21 13:28:27.508','2020-03-24 12:04:01.519',2)
,(5,'Profit Month  3.5%',3.50,1,'2020-01-03 18:25:54.193','2020-03-24 12:47:07.645',2)
;

/*AssetClass*/


-- Drop table

-- DROP TABLE public."AssetClass";

CREATE TABLE public."AssetClass" (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "AssetClass_name_key" UNIQUE ("name"),
	CONSTRAINT "AssetClass_pkey" PRIMARY KEY (id)
);

INSERT INTO public."AssetClass" (id,"name",status,"createdAt","updatedAt") VALUES
(1,'CO',1,'2020-03-07 23:47:18.320','2020-03-07 23:47:18.321')
,(3,'Bo',1,'2020-03-07 23:46:07.362','2020-03-07 23:47:32.074')
,(6,'CFD',1,'2020-03-07 23:48:58.978','2020-03-07 23:48:58.978')
,(7,'ETC',1,'2020-03-07 23:48:17.297','2020-03-07 23:49:02.496')
,(8,'ETF',1,'2020-03-07 23:48:04.555','2020-03-07 23:49:05.259')
,(9,'FxO',1,'2020-03-07 23:49:28.534','2020-03-07 23:49:28.535')
,(10,'Fx',1,'2020-03-07 23:49:40.930','2020-03-15 23:32:17.556')
,(5,'EQ',1,'2020-03-07 23:48:47.197','2020-03-16 16:23:56.213')
,(4,'EQO',1,'2020-03-07 23:48:33.365','2020-03-16 16:24:03.812')
,(2,'FT',1,'2020-03-07 23:47:28.670','2020-03-16 16:24:14.781')
;
INSERT INTO public."AssetClass" (id,"name",status,"createdAt","updatedAt") VALUES
(12,'CFDs Barrels',1,'2020-03-21 13:42:21.539','2020-03-21 13:42:29.949')
,(11,'CFDs Ounces',1,'2020-03-21 13:41:59.665','2020-03-21 13:43:21.949')
;

/*Broker*/

-- Drop table

-- DROP TABLE public."Broker";

CREATE TABLE public."Broker" (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Broker_name_key" UNIQUE (name),
	CONSTRAINT "Broker_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Broker" (id,"name",status,"createdAt","updatedAt") VALUES
(2,'Alessandro L.',1,'2020-02-27 08:52:12.351','2020-02-27 08:52:12.351')
,(3,'Andres Valerio',1,'2020-02-27 08:52:27.866','2020-02-27 08:52:27.866')
,(4,'Vladimir Roca',1,'2020-03-16 16:21:40.697','2020-03-16 16:21:40.698')
,(5,'Steffano Borja',1,'2020-03-16 16:21:56.486','2020-03-16 16:21:56.486')
,(6,'Joe Prada',1,'2020-03-16 16:22:09.103','2020-03-16 16:22:09.104')
,(7,'Fabio Torres',1,'2020-03-16 16:22:21.392','2020-03-16 16:22:21.392')
,(8,'Anthony Betancourt',1,'2020-03-16 16:22:34.069','2020-03-16 16:22:34.069')
,(1,'Roberto M.',0,'2020-02-22 11:43:19.965','2020-03-25 17:08:48.817')
,(9,'Robert M.',1,'2020-03-25 17:09:10.758','2020-03-25 17:09:10.758')
;

/*Commodity*/

-- Drop table

-- DROP TABLE public."Commodity";

CREATE TABLE public."Commodity" (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Commodity_name_key" UNIQUE (name),
	CONSTRAINT "Commodity_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Commodity" (id,"name",status,"createdAt","updatedAt") VALUES
(1,'Stocks',1,'2020-02-24 20:56:08.846','2020-02-24 20:56:08.846')
,(2,'Commodities',1,'2020-02-24 20:56:08.846','2020-03-16 16:24:40.801')
,(4,'Forex',1,'2020-03-16 16:24:50.756','2020-03-16 16:24:50.756')
,(5,'No trade',1,'2020-03-16 16:46:35.957','2020-03-16 16:46:35.960')
;

/*InvestmentMovement*/

-- Drop table

-- DROP TABLE public."InvestmentMovement";

CREATE TABLE public."InvestmentMovement" (
	id serial NOT NULL,
	"investmentOperationId" int4 NOT NULL,
	"gpInversion" numeric(10,2) NULL,
	"gpAmount" numeric(10,2) NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "InvestmentMovement_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."InvestmentMovement" ADD CONSTRAINT "InvestmentMovement_investmentOperationId_fkey" FOREIGN KEY ("investmentOperationId") REFERENCES "InvestmentOperation"(id);

INSERT INTO public."InvestmentMovement" (id,"investmentOperationId","gpInversion","gpAmount",status,"createdAt","updatedAt") VALUES
(1,1,20000.00,0.00,1,'2020-03-17 18:04:56.801','2020-03-17 18:04:56.801')
,(2,1,20150.00,150.00,1,'2020-03-17 18:06:43.404','2020-03-17 18:07:22.104')
,(3,1,20300.00,150.00,1,'2020-03-17 18:08:12.516','2020-03-17 18:08:14.735')
,(4,1,20450.00,150.00,1,'2020-03-17 18:08:19.812','2020-03-17 18:08:20.575')
,(5,1,20600.00,150.00,1,'2020-03-17 18:08:24.469','2020-03-17 18:08:24.888')
,(6,2,20000.00,0.00,1,'2020-03-17 20:16:29.316','2020-03-17 20:16:29.317')
,(7,2,20250.00,250.00,1,'2020-03-17 20:17:37.048','2020-03-17 20:17:55.048')
,(8,2,20500.00,250.00,1,'2020-03-17 20:18:01.168','2020-03-17 20:18:03.910')
,(9,2,20750.00,250.00,1,'2020-03-17 20:18:07.935','2020-03-17 20:18:09.263')
,(10,2,21000.00,250.00,1,'2020-03-17 20:18:14.639','2020-03-17 20:18:14.714')
;
INSERT INTO public."InvestmentMovement" (id,"investmentOperationId","gpInversion","gpAmount",status,"createdAt","updatedAt") VALUES
(11,2,21262.50,262.50,1,'2020-03-17 20:19:55.228','2020-03-17 20:20:15.855')
,(14,3,56062.50,6062.50,1,'2020-03-24 15:37:39.405','2020-03-24 15:38:19.181')
,(15,3,56062.50,6062.50,1,'2020-03-24 15:37:39.405','2020-03-24 15:38:23.043')
,(16,4,50000.00,0.00,1,'2020-03-24 15:39:48.188','2020-03-24 15:39:48.188')
,(17,4,56062.50,6062.50,1,'2020-03-24 15:40:19.094','2020-03-24 15:40:34.743')
,(18,5,41415.57,0.00,1,'2020-03-24 18:35:50.320','2020-03-24 18:35:50.320')
,(19,5,42658.02,1242.45,1,'2020-03-24 18:36:29.269','2020-03-24 18:36:46.991')
,(20,6,6541.69,0.00,1,'2020-03-25 16:27:57.533','2020-03-25 16:27:57.533')
,(21,6,6722.79,181.10,1,'2020-03-25 16:31:25.578','2020-03-25 16:32:01.502')
,(22,7,6312.48,0.00,1,'2020-03-25 17:51:00.319','2020-03-25 17:51:00.319')
;
INSERT INTO public."InvestmentMovement" (id,"investmentOperationId","gpInversion","gpAmount",status,"createdAt","updatedAt") VALUES
(23,7,6365.26,52.78,1,'2020-03-25 17:51:08.884','2020-03-25 17:51:20.885')
,(24,4,56500.00,437.50,1,'2020-03-25 18:59:34.532','2020-03-25 18:59:59.261')
;

/*InvestmentOperation*/

-- Drop table

-- DROP TABLE public."InvestmentOperation";

CREATE TABLE public."InvestmentOperation" (
	id serial NOT NULL,
	"operationType" varchar(255) NULL,
	"userAccountId" int4 NOT NULL,
	amount numeric(10,2) NULL,
	"initialAmount" numeric(10,2) NULL,
	status int4 NOT NULL,
	"startDate" timestamptz NULL,
	"endDate" timestamptz NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "InvestmentOperation_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."InvestmentOperation" ADD CONSTRAINT "InvestmentOperation_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"(id);

INSERT INTO public."InvestmentOperation" (id,"operationType","userAccountId",amount,"initialAmount",status,"startDate","endDate","createdAt","updatedAt") VALUES
(1,'Multiactivo',3,20600.00,20600.00,0,'2020-03-17 18:04:44.000','1969-12-31 18:00:00.001','2020-03-17 18:04:56.792','2020-03-17 19:59:08.449')
,(3,'Multiactivos',8,68187.50,50000.00,0,'2020-01-09 16:30:56.000','2021-01-09 16:31:04.000','2020-03-24 15:31:16.432','2020-03-24 15:39:09.975')
,(2,'Multiactivos',4,21262.50,20000.00,0,'2020-03-17 20:16:16.000','2021-03-17 20:16:21.000','2020-03-17 20:16:29.309','2020-03-24 15:49:24.369')
,(5,'Multiactivos',10,42658.02,41415.57,1,'2019-07-30 18:35:13.000','2021-07-30 18:35:37.000','2020-03-24 18:35:50.311','2020-03-24 18:35:50.312')
,(6,'Multiactivos',75,6722.79,6541.69,1,'2019-10-02 16:26:24.000','2020-10-02 16:27:23.000','2020-03-25 16:27:57.526','2020-03-25 16:27:57.526')
,(7,'Multiactivos',98,6365.26,6312.48,1,'2019-05-16 17:50:40.000','2020-05-16 17:50:52.000','2020-03-25 17:51:00.311','2020-03-25 17:51:00.312')
,(4,'Multiactivos',8,56500.00,50000.00,1,'2020-01-09 16:39:33.000','2021-01-09 16:39:41.000','2020-03-24 15:39:48.180','2020-03-24 15:39:48.180')
;

/*MarketMovement*/


-- Drop table

-- DROP TABLE public."MarketMovement";

CREATE TABLE public."MarketMovement" (
	id serial NOT NULL,
	"marketOperationId" int4 NOT NULL,
	"gpInversion" numeric(10,2) NULL,
	"gpAmount" numeric(10,2) NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "MarketMovement_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."MarketMovement" ADD CONSTRAINT "MarketMovement_marketOperationId_fkey" FOREIGN KEY ("marketOperationId") REFERENCES "MarketOperation"(id);

ALTER TABLE public."MarketMovement" ADD "marketPrice" numeric(10,2) NULL;

INSERT INTO public."MarketMovement" (id,"marketOperationId","gpInversion","gpAmount",status,"createdAt","updatedAt") VALUES
(1,1,2000.00,0.00,1,'2020-03-16 16:59:05.000','2020-03-16 16:59:08.530')
,(2,1,2030.00,30.00,1,'2020-03-16 17:03:27.978','2020-03-16 17:03:40.056')
,(3,1,2000.00,-30.00,1,'2020-03-16 17:04:37.111','2020-03-16 17:04:42.817')
,(4,1,2100.00,100.00,1,'2020-03-16 17:05:57.385','2020-03-16 17:06:20.652')
,(5,1,2000.00,-100.00,1,'2020-03-16 17:07:55.060','2020-03-16 17:08:17.076')
,(6,2,700.00,0.00,1,'2020-03-16 17:21:43.000','2020-03-16 17:21:44.999')
,(7,2,690.00,-10.00,1,'2020-03-16 17:22:14.882','2020-03-16 17:22:29.255')
,(8,2,790.00,100.00,1,'2020-03-16 17:27:50.172','2020-03-16 17:28:09.697')
,(9,2,640.00,-150.00,1,'2020-03-16 18:39:06.161','2020-03-16 18:39:26.578')
,(10,2,540.00,-100.00,1,'2020-03-16 18:44:05.382','2020-03-16 18:45:11.156')
;
INSERT INTO public."MarketMovement" (id,"marketOperationId","gpInversion","gpAmount",status,"createdAt","updatedAt") VALUES
(11,2,-1460.00,-2000.00,1,'2020-03-16 18:45:26.482','2020-03-16 18:45:38.438')
,(12,2,-6460.00,-5000.00,1,'2020-03-16 18:45:47.671','2020-03-16 18:45:52.466')
,(13,3,5000.00,0.00,3,'2020-03-16 18:48:29.000','2020-03-16 18:48:31.584')
,(14,4,5000.00,0.00,1,'2020-03-16 18:57:18.000','2020-03-16 18:57:19.469')
,(15,5,5000.00,0.00,1,'2020-03-16 19:02:04.000','2020-03-16 19:02:08.162')
,(16,5,4600.00,-400.00,1,'2020-03-16 19:03:40.897','2020-03-16 19:03:45.031')
,(17,6,9592.20,0.00,1,'2020-03-17 17:23:41.000','2020-03-17 17:23:42.631')
,(18,7,9592.20,0.00,1,'2020-03-17 17:26:48.000','2020-03-17 17:26:49.273')
,(19,7,10192.20,600.00,1,'2020-03-17 17:29:12.499','2020-03-17 17:29:35.371')
,(20,7,5192.20,-5000.00,1,'2020-03-17 17:39:04.988','2020-03-17 17:39:45.818')
;
INSERT INTO public."MarketMovement" (id,"marketOperationId","gpInversion","gpAmount",status,"createdAt","updatedAt") VALUES
(21,8,9592.20,0.00,1,'2020-03-17 17:46:37.000','2020-03-17 17:46:38.383')
,(22,8,10192.20,600.00,1,'2020-03-17 17:47:56.418','2020-03-17 17:48:21.956')
,(23,8,5192.20,-5000.00,1,'2020-03-17 17:50:22.530','2020-03-17 17:51:22.712')
,(24,8,10192.20,5000.00,1,'2020-03-17 18:13:15.572','2020-03-17 18:13:19.714')
,(25,9,2150.00,0.00,1,'2020-03-17 20:03:01.000','2020-03-17 20:03:09.212')
,(26,9,2550.00,400.00,1,'2020-03-17 20:05:25.727','2020-03-17 20:05:27.815')
,(27,9,3050.00,500.00,1,'2020-03-17 20:06:12.862','2020-03-17 20:06:14.092')
,(28,9,2050.00,-1000.00,1,'2020-03-17 20:06:52.117','2020-03-17 20:07:10.873')
,(29,9,1050.00,0.00,1,'2020-03-18 20:07:49.412','2020-03-20 20:04:19.287')
,(30,9,3050.00,1000.00,1,'2020-03-21 00:50:05.717','2020-03-21 00:51:00.376')
;
INSERT INTO public."MarketMovement" (id,"marketOperationId","gpInversion","gpAmount",status,"createdAt","updatedAt") VALUES
(31,9,2000.00,-1050.00,1,'2020-03-21 00:51:46.653','2020-03-21 00:51:58.187')
,(32,9,3100.00,1100.00,1,'2020-03-21 00:52:09.500','2020-03-21 00:52:20.807')
,(45,10,3456.20,525.00,1,'2020-03-21 13:52:27.178','2020-03-21 13:53:25.828')
,(52,16,11060.00,2990.00,1,'2020-03-24 11:32:56.695','2020-03-24 11:33:23.484')
,(54,17,4840.00,-1210.00,1,'2020-03-24 11:37:45.813','2020-03-24 11:37:54.298')
,(57,18,4008.50,2000.00,1,'2020-03-24 17:54:33.640','2020-03-24 17:54:48.312')
,(64,19,54400.00,6000.00,1,'2020-03-25 17:17:01.981','2020-03-25 17:17:09.886')
,(66,25,97668.00,-7812.00,1,'2020-03-25 17:25:45.097','2020-03-25 17:25:57.454')
,(68,26,45375.00,-15125.00,1,'2020-03-25 17:29:10.415','2020-03-25 17:29:51.340')
,(70,27,6247.00,4650.00,1,'2020-03-25 17:48:15.843','2020-03-25 17:48:30.423')
;

/*MarketOperation*/


-- Drop table

-- DROP TABLE public."MarketOperation";

CREATE TABLE public."MarketOperation" (
	id serial NOT NULL,
	"longShort" varchar(255) NULL,
	"commoditiesTotal" varchar(255) NULL,
	"buyPrice" numeric(10,2) NULL,
	"initialAmount" numeric(10,2) NULL,
	"takingProfit" numeric(10,2) NULL,
	"stopLost" varchar(255) NULL,
	"maintenanceMargin" numeric(10,2) NULL,
	"orderId" int4 NULL,
	"userAccountId" int4 NOT NULL,
	"productId" int4 NOT NULL,
	"brokerId" int4 NOT NULL,
	"commodityId" int4 NOT NULL,
	"assetClassId" int4 NOT NULL,
	amount numeric(10,2) NULL,
	status int4 NOT NULL,
	"endDate" timestamptz NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NULL,
	behavior int4 NULL DEFAULT 1,
	CONSTRAINT "MarketOperation_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."MarketOperation" ADD CONSTRAINT "MarketOperation_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "AssetClass"(id);
ALTER TABLE public."MarketOperation" ADD CONSTRAINT "MarketOperation_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"(id);
ALTER TABLE public."MarketOperation" ADD CONSTRAINT "MarketOperation_commodityId_fkey" FOREIGN KEY ("commodityId") REFERENCES "Commodity"(id);
ALTER TABLE public."MarketOperation" ADD CONSTRAINT "MarketOperation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id);
ALTER TABLE public."MarketOperation" ADD CONSTRAINT "MarketOperation_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"(id);


INSERT INTO public."MarketOperation" (id,"longShort","commoditiesTotal","buyPrice","initialAmount","takingProfit","stopLost","maintenanceMargin","orderId","userAccountId","productId","brokerId","commodityId","assetClassId",amount,status,"endDate","createdAt","updatedAt",behavior) VALUES
(21,'Long','8',1660.00,48400.00,1700.00,'35',44000.00,54879587,87,84,9,2,2,48400.00,0,NULL,'2020-03-11 17:13:10.000','2020-03-25 17:16:14.040',1)
,(19,'Long','8',1660.00,48400.00,1700.00,'35%',44000.00,54879587,87,84,9,2,2,54400.00,1,NULL,'2020-03-11 17:13:10.000','2020-03-25 17:13:31.053',1)
,(25,'Long','3600',29.30,105480.00,84.30,'25%',0.00,65784521,87,5,9,1,5,97668.00,1,NULL,'2020-02-26 17:24:28.000','2020-03-25 17:24:37.535',2)
,(1,'Long ','250',240.00,2000.00,270.00,'25',1500.00,800753,2,6,4,1,6,2000.00,0,NULL,'2020-03-16 16:59:05.000','2020-03-16 17:20:35.574',2)
,(26,'Long','10',17.90,60500.00,19.25,'25',55000.00,36521487,87,85,9,2,2,45375.00,3,NULL,'2020-02-26 17:28:46.000','2020-03-25 17:30:22.548',2)
,(27,'Short','500',32.10,1597.00,20.00,'25',798.50,84512369,96,61,9,2,12,6247.00,3,NULL,'2020-03-13 17:47:27.000','2020-03-25 17:48:56.917',1)
,(2,'Long ','50',23.12,700.00,24.10,'20%',450.00,800754,2,5,6,1,6,-6460.00,0,NULL,'2020-03-16 17:21:43.000','2020-03-16 18:46:46.416',2)
,(3,'Long ','250',375.00,5000.00,380.00,'20%',4500.00,800754,2,6,6,1,6,5000.00,0,NULL,'2020-03-16 18:48:29.000','2020-03-16 18:54:17.030',0)
,(4,'Long ','250',375.00,5000.00,380.00,'20%',4500.00,800754,2,6,6,1,6,5000.00,0,NULL,'2020-03-16 18:57:18.000','2020-03-16 18:59:09.035',0)
,(5,'Long ','250',375.00,5000.00,380.00,'20%',4500.00,800754,2,6,6,1,6,4600.00,0,NULL,'2020-03-16 19:02:04.000','2020-03-17 17:20:13.303',2)
;
INSERT INTO public."MarketOperation" (id,"longShort","commoditiesTotal","buyPrice","initialAmount","takingProfit","stopLost","maintenanceMargin","orderId","userAccountId","productId","brokerId","commodityId","assetClassId",amount,status,"endDate","createdAt","updatedAt",behavior) VALUES
(6,'Long ','250',313.00,9592.20,380.00,'20%',4796.10,800754,2,6,6,1,6,9592.20,0,NULL,'2020-03-17 17:23:41.000','2020-03-17 17:25:03.185',0)
,(12,'Long ','35',1665.00,2931.20,1720.00,'15%',1465.40,54689885,6,84,7,2,6,2931.20,0,NULL,'2020-02-24 14:36:55.000','2020-03-21 13:40:36.461',1)
,(15,'Long ','35',1665.00,2931.20,1720.00,'15%',1465.40,54689885,6,84,7,2,6,2931.20,0,NULL,'2020-02-24 14:36:55.000','2020-03-21 13:40:42.246',1)
,(7,'Long ','150',313.50,9592.20,380.00,'20%',4796.10,800754,2,6,6,1,1,5192.20,0,NULL,'2020-03-17 17:26:48.000','2020-03-17 17:44:07.922',2)
,(11,'Long ','35',1665.00,2931.20,1720.00,'15%',1465.40,54689885,6,84,7,2,6,2931.20,0,NULL,'2020-02-24 14:36:55.000','2020-03-21 13:40:52.147',1)
,(13,'Long ','35',1665.00,2931.20,1720.00,'15%',1465.40,54689885,6,84,7,2,6,2931.20,0,NULL,'2020-02-24 14:36:55.000','2020-03-21 13:40:57.289',1)
,(14,'Long ','35',1665.00,2931.20,1720.00,'15%',1465.40,54689885,6,84,7,2,6,2931.20,0,NULL,'2020-02-24 14:36:55.000','2020-03-21 13:41:03.258',1)
,(10,'Long ','35',1665.00,2931.20,1720.00,'15%',1465.40,54689885,6,84,7,2,11,3456.20,3,NULL,'2020-02-24 14:36:55.000','2020-03-23 07:18:24.201',1)
,(16,'Short','2600',31.00,8070.00,28.50,'10%',4035.00,41445796,7,61,2,2,12,11060.00,1,NULL,'2020-03-12 11:31:45.000','2020-03-24 11:31:51.806',1)
,(17,'Long ','1',15.78,6050.00,17.20,'20%',5500.00,48751562,7,85,2,2,2,4840.00,1,NULL,'2020-03-12 11:37:02.000','2020-03-24 11:37:08.218',2)
;
INSERT INTO public."MarketOperation" (id,"longShort","commoditiesTotal","buyPrice","initialAmount","takingProfit","stopLost","maintenanceMargin","orderId","userAccountId","productId","brokerId","commodityId","assetClassId",amount,status,"endDate","createdAt","updatedAt",behavior) VALUES
(9,'Long ','20',421.00,2150.00,450.00,'20%',1720.00,800754,2,4,1,1,1,3100.00,0,NULL,'2020-03-17 20:03:01.000','2020-03-24 17:54:03.327',1)
,(8,'Long ','150',313.50,9592.20,380.00,'20%',4796.10,800754,2,6,6,1,1,10192.20,0,NULL,'2020-03-17 17:46:37.000','2020-03-17 20:00:43.216',1)
,(18,'Long ','25',1600.00,2008.50,1720.00,'20%',1004.19,65985201,9,84,4,2,11,4008.50,3,NULL,'2020-02-18 18:53:32.000','2020-03-24 18:19:31.210',1)
,(22,'Long','8',1660.00,344787.30,1700.00,'35',44000.00,54879587,19,84,9,2,2,344787.30,0,NULL,'2020-03-11 17:13:10.000','2020-03-25 17:15:35.486',1)
,(20,'Long','8',1660.00,48400.00,1700.00,'35',44000.00,54879587,87,84,9,2,2,48400.00,0,NULL,'2020-03-11 17:13:10.000','2020-03-25 17:15:49.475',1)
,(24,'Long','8',1660.00,344787.30,1700.00,'35%',44000.00,54879587,87,84,9,2,2,344787.30,0,NULL,'2020-03-11 17:13:10.000','2020-03-25 17:15:55.474',1)
,(23,'Long','8',1660.00,344787.30,1700.00,'35',44000.00,54879587,87,84,9,2,2,344787.30,0,NULL,'2020-03-11 17:13:10.000','2020-03-25 17:16:02.642',1)
;

/*Page*/


-- Drop table

-- DROP TABLE public."Page";

CREATE TABLE public."Page" (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"content" text NOT NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Page_name_key" UNIQUE (name),
	CONSTRAINT "Page_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Page" (id,"name","content",status,"createdAt","updatedAt") VALUES
(2,'Calendario Económico','<h3 style="text-align: center; color:#000">Calendario económico muestra los próximos eventos económicos, anuncios y noticias.</h3>
&nbsp;

<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
<div class="tradingview-widget-container__widget"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/markets/currencies/economic-calendar/" target="_blank" rel="noopener"><span class="blue-text">Economic Calendar</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-events.js" async>
  {
  "width": "100%",
  "height": "900",
  "locale": "en",
  "importanceFilter": "-1,0,1"
}
  </script>

</div>
<!-- TradingView Widget END -->',1,'2020-03-23 23:48:47.000','2020-03-24 16:45:10.776')
,(1,'Mercado','<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div id="tradingview_86ca6"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" target="_blank" rel="noopener"><span class="blue-text">AAPL chart</span></a> by TradingView</div>
<script  async="" type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script  async="" type="text/javascript">
  new TradingView.widget(
  {
  "width": 475,
  "height": 400,
  "symbol": "NASDAQ:AAPL",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "container_id": "tradingview_86ca6"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div id="tradingview_e06cd"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AMZN/" target="_blank" rel="noopener"><span class="blue-text">AMZN chart</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script type="text/javascript">
  new TradingView.widget(
  {
  "width": 475,
  "height": 400,
  "symbol": "NASDAQ:AMZN",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "container_id": "tradingview_e06cd"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div id="tradingview_90b83"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-NFLX/" target="_blank" rel="noopener"><span class="blue-text">NFLX chart</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script type="text/javascript">
  new TradingView.widget(
  {
  "width": 475,
  "height": 400,
  "symbol": "NASDAQ:NFLX",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "container_id": "tradingview_90b83"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div id="tradingview_dd41b"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-NDX/" target="_blank" rel="noopener"><span class="blue-text">NDX chart</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script type="text/javascript">
  new TradingView.widget(
  {
  "width": 475,
  "height": 400,
  "symbol": "NASDAQ:NDX",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "container_id": "tradingview_dd41b"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
<div style="background-color: #e8e6e6;">
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div class="tradingview-widget-container__widget"></div>
<div class="tradingview-widget-copyright"><a href="https://es.tradingview.com" target="_blank" rel="noopener"><span class="blue-text">Cotizaciones</span></a> por TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-tickers.js" async>
  {
  "symbols": [
    {
      "title": "S&P 500",
      "proName": "INDEX:SPX"
    },
    {
      "title": "Nasdaq 100",
      "proName": "INDEX:IUXX"
    },
    {
      "title": "BTC/USD",
      "proName": "BITFINEX:BTCUSD"
    },
    {
      "title": "ETH/USD",
      "proName": "BITFINEX:ETHUSD"
    },
    {
      "description": "",
      "proName": "CME:BTC1!"
    }
  ],
  "locale": "es"
}
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div class="tradingview-widget-container__widget"></div>
<div class="tradingview-widget-copyright"><a href="https://es.tradingview.com" target="_blank" rel="noopener"><span class="blue-text">Datos del mercado</span></a> por TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>
  {
  "showChart": true,
  "locale": "es",
  "largeChartUrl": "",
  "width": "100%",
  "height": "660",
  "plotLineColorGrowing": "rgba(60, 188, 152, 1)",
  "plotLineColorFalling": "rgba(255, 74, 104, 1)",
  "gridLineColor": "rgba(233, 233, 234, 1)",
  "scaleFontColor": "rgba(233, 233, 234, 1)",
  "belowLineFillColorGrowing": "rgba(60, 188, 152, 0.05)",
  "belowLineFillColorFalling": "rgba(255, 74, 104, 0.05)",
  "symbolActiveColor": "rgba(242, 250, 254, 1)",
  "tabs": [
    {
      "title": "Índices",
      "symbols": [
        {
          "s": "INDEX:SPX",
          "d": "S&P 500"
        },
        {
          "s": "INDEX:DOWI",
          "d": "Dow 30"
        },
        {
          "s": "INDEX:NKY",
          "d": "Nikkei 225"
        },
        {
          "s": "NASDAQ:AAPL",
          "d": "Apple"
        },
        {
          "s": "NASDAQ:GOOG",
          "d": "Google"
        }
      ],
      "originalTitle": "Indices"
    },
    {
      "title": "Materias primas",
      "symbols": [
        {
          "s": "COMEX:GC1!",
          "d": "Oro"
        },
        {
          "s": "NYMEX:CL1!",
          "d": "Petróleo"
        },
        {
          "s": "NYMEX:NG1!",
          "d": "Gas natural"
        },
        {
          "s": "CBOT:ZC1!",
          "d": "Maíz"
        },
        {
          "s": "MOEX:BR1!"
        }
      ],
      "originalTitle": "Commodities"
    },
    {
      "title": "Bonos",
      "symbols": [
        {
          "s": "CME:GE1!",
          "d": "Eurodólar"
        },
        {
          "s": "CBOT:ZB1!",
          "d": "T-Bond"
        },
        {
          "s": "CBOT:UD1!",
          "d": "Ultra T-Bond"
        },
        {
          "s": "EUREX:GG1!",
          "d": "Euro Bund"
        },
        {
          "s": "EUREX:II1!",
          "d": "Euro BTP"
        },
        {
          "s": "EUREX:HR1!",
          "d": "Euro BOBL"
        }
      ],
      "originalTitle": "Bonds"
    },
    {
      "title": "Forex",
      "symbols": [
        {
          "s": "FX:EURUSD"
        },
        {
          "s": "FX:GBPUSD"
        },
        {
          "s": "FX:USDJPY"
        },
        {
          "s": "FX:USDCHF"
        },
        {
          "s": "FX:AUDUSD"
        },
        {
          "s": "FX:USDCAD"
        }
      ],
      "originalTitle": "Forex"
    }
  ]
}
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div class="tradingview-widget-container__widget"></div>
<div class="tradingview-widget-copyright"><a href="https://es.tradingview.com/markets/stocks-usa/market-movers-gainers/" target="_blank" rel="noopener"><span class="blue-text">Mercado bursátil</span></a> por TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js" async>
  {
  "exchange": "US",
  "showChart": true,
  "locale": "es",
  "largeChartUrl": "",
  "width": "100%",
  "height": "660",
  "plotLineColorGrowing": "rgba(60, 188, 152, 1)",
  "plotLineColorFalling": "rgba(255, 74, 104, 1)",
  "gridLineColor": "rgba(242, 242, 242, 1)",
  "scaleFontColor": "rgba(218, 221, 224, 1)",
  "belowLineFillColorGrowing": "rgba(60, 188, 152, 0.05)",
  "belowLineFillColorFalling": "rgba(255, 74, 104, 0.05)",
  "symbolActiveColor": "rgba(242, 250, 254, 1)"
}
  </script>
</div>
<!-- TradingView Widget END -->
</div>',1,'2020-03-23 22:48:47.000','2020-03-24 16:46:06.547')
;

/*Product*/


-- Drop table

-- DROP TABLE public."Product";

CREATE TABLE public."Product" (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	code varchar(255) NOT NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Product_name_key" UNIQUE (name),
	CONSTRAINT "Product_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(1,'American Airlines Group Inc.','AAL',1,'2020-02-22 11:43:19.959','2020-02-22 11:43:19.959')
,(2,'Aaon Inc.','AAON',1,'2020-02-22 11:43:19.959','2020-02-22 11:43:19.959')
,(3,'Apple Inc.','AAPL',1,'2020-02-22 11:43:19.959','2020-02-22 11:43:19.959')
,(4,'Tesla','TSLA',1,'2020-02-27 11:07:46.381','2020-02-27 11:07:46.381')
,(5,'Moderna Inc',' MRNA',1,'2020-02-27 13:22:00.424','2020-02-27 13:22:10.143')
,(6,'Netflix','NFLX',1,'2020-03-16 16:25:31.546','2020-03-16 16:25:31.546')
,(7,'Amazon','AMZN',1,'2020-03-21 00:53:29.913','2020-03-21 00:53:29.914')
,(10,' Microsoft Corp','MSFT	',1,'2020-03-21 11:57:17.786','2020-03-21 11:57:17.786')
,(9,'Crude Oil WTI','Crude Oil WTI May ''20 (CLK20)',0,'2020-03-21 11:55:33.900','2020-03-21 11:57:38.417')
,(8,'Gold','Gold Apr ''20 (GCJ20)',0,'2020-03-21 11:54:46.925','2020-03-21 11:57:42.476')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(11,'Facebook Inc','FB	 ',1,'2020-03-21 11:58:12.380','2020-03-21 11:58:12.380')
,(12,'Alphabet Cl A','GOOGL	 ',1,'2020-03-21 11:58:44.677','2020-03-21 11:58:44.677')
,(13,'Adv Micro Devices','AMD',1,'2020-03-21 11:59:25.217','2020-03-21 11:59:25.217')
,(14,'Nvidia Corp','NVDA	 ',1,'2020-03-21 11:59:55.143','2020-03-21 11:59:55.143')
,(15,'Boeing Company','BA	 ',1,'2020-03-21 12:00:34.424','2020-03-21 12:00:34.424')
,(16,' Alphabet Cl C','GOOG	',1,'2020-03-21 12:01:32.353','2020-03-21 12:01:32.353')
,(17,'Alibaba Group Holding','BABA	 ',1,'2020-03-21 12:10:06.272','2020-03-21 12:10:06.272')
,(18,'AT&T Inc',' T	 ',1,'2020-03-21 12:10:29.708','2020-03-21 12:10:29.709')
,(19,'Bank of America Corp',' BAC	 ',1,'2020-03-21 12:10:56.470','2020-03-21 12:10:56.470')
,(20,'Walt Disney Company','DIS	 ',1,'2020-03-21 12:11:20.735','2020-03-21 12:11:20.735')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(21,'Visa Inc',' V	 ',1,'2020-03-21 12:11:48.802','2020-03-21 12:11:48.802')
,(22,'Berkshire Hathaway Cl B',' BRK.B	 ',1,'2020-03-21 12:12:13.084','2020-03-21 12:12:13.085')
,(23,'Gilead Sciences Inc',' GILD	 ',1,'2020-03-21 12:12:54.072','2020-03-21 12:12:54.072')
,(24,' JP Morgan Chase & Company',' JPM	',1,'2020-03-21 12:13:20.003','2020-03-21 12:13:20.003')
,(25,' Exxon Mobil Corp','XOM	',1,'2020-03-21 12:13:51.119','2020-03-21 12:13:51.119')
,(26,'Intel Corp',' INTC	 ',1,'2020-03-21 12:15:01.485','2020-03-21 12:15:01.486')
,(27,'Verizon Communications Inc',' VZ	 ',1,'2020-03-21 12:15:27.479','2020-03-21 12:15:27.479')
,(28,'Johnson & Johnson',' JNJ	 ',1,'2020-03-21 12:15:47.887','2020-03-21 12:15:47.887')
,(29,'Mastercard Inc','MA	 ',1,'2020-03-21 12:16:30.112','2020-03-21 12:16:30.112')
,(30,'Adobe Systems Inc','ADBE	 ',1,'2020-03-21 12:17:14.646','2020-03-21 12:17:14.646')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(31,'Wal-Mart Stores',' WMT	 ',1,'2020-03-21 12:17:51.488','2020-03-21 12:17:51.488')
,(32,'Procter & Gamble Company',' PG	 ',1,'2020-03-21 12:18:41.652','2020-03-21 12:18:41.652')
,(33,'Coca-Cola Company',' KO	 ',1,'2020-03-21 12:19:13.858','2020-03-21 12:19:13.858')
,(34,'Wells Fargo & Company',' WFC	 ',1,'2020-03-21 12:20:31.498','2020-03-21 12:20:31.498')
,(35,'Unitedhealth Group Inc','UNH	 ',1,'2020-03-21 12:21:34.299','2020-03-21 12:21:34.299')
,(36,'Home Depot',' HD	 ',1,'2020-03-21 12:21:56.281','2020-03-21 12:21:56.281')
,(37,'Costco Wholesale','COST	 ',1,'2020-03-21 12:22:31.585','2020-03-21 12:22:31.585')
,(38,'Zoom Video Communications Cl A','ZM	 ',1,'2020-03-21 12:23:18.067','2020-03-21 12:23:18.067')
,(39,' McDonald''s Corp',' MCD	',1,'2020-03-21 12:23:39.105','2020-03-21 12:23:39.105')
,(40,'Salesforce.com Inc','CRM	 ',1,'2020-03-21 12:24:10.572','2020-03-21 12:24:10.572')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(41,' Cisco Systems Inc',' CSCO	',1,'2020-03-21 12:25:26.380','2020-03-21 12:25:26.380')
,(42,'Starbucks Corp',' SBUX	 ',1,'2020-03-21 12:26:02.288','2020-03-21 12:26:02.288')
,(43,'Uber Technologies Inc','UBER	 ',1,'2020-03-21 12:26:25.636','2020-03-21 12:26:25.637')
,(44,' Chevron Corp',' CVX	',1,'2020-03-21 12:26:48.740','2020-03-21 12:26:48.740')
,(45,'Comcast Corp A',' CMCSA	 ',1,'2020-03-21 12:27:12.792','2020-03-21 12:27:12.792')
,(46,'Merck & Company','MRK	 ',1,'2020-03-21 12:27:39.954','2020-03-21 12:27:39.954')
,(47,'Pfizer Inc',' PFE	 ',1,'2020-03-21 12:28:07.573','2020-03-21 12:28:07.573')
,(48,'Square',' SQ	 ',1,'2020-03-21 12:29:04.597','2020-03-21 12:29:04.598')
,(49,'Qualcomm Inc','QCOM	 ',1,'2020-03-21 12:29:47.589','2020-03-21 12:29:47.589')
,(50,'International Business Machines',' IBM	 ',1,'2020-03-21 12:30:55.010','2020-03-21 12:30:55.010')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(51,' U.S. Dollar Index','DXY00	',1,'2020-03-21 12:35:01.642','2020-03-21 12:35:01.642')
,(52,'Euro Fx/U.S. Dollar','EURUSD	 ',1,'2020-03-21 12:35:29.170','2020-03-21 12:35:29.170')
,(53,' U.S. Dollar/Canadian Dollar','USDCAD	',1,'2020-03-21 12:35:52.897','2020-03-21 12:35:52.897')
,(54,'U.S. Dollar/Japanese Yen','USDJPY	 ',1,'2020-03-21 12:36:16.207','2020-03-21 12:36:16.208')
,(55,'U.S. Dollar/Swiss Franc','USDCHF	 ',1,'2020-03-21 12:36:40.010','2020-03-21 12:36:40.010')
,(56,'British Pound/U.S. Dollar','GBPUSD	 ',1,'2020-03-21 12:37:05.669','2020-03-21 12:37:05.669')
,(57,'Australian Dollar/U.S. Dollar','AUDUSD	 ',1,'2020-03-21 12:37:36.900','2020-03-21 12:37:36.900')
,(58,' U.S. Dollar/Chinese Yuan','USDCNY	',1,'2020-03-21 12:38:09.870','2020-03-21 12:38:09.870')
,(59,'Bitcoin Futures CME','BTC',1,'2020-03-21 12:40:01.947','2020-03-21 12:40:01.947')
,(60,'NYSE Bitcoin','NYXBT',1,'2020-03-21 12:40:54.682','2020-03-21 12:40:54.682')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(61,'Crude Oil WTI (May ''20)',' CLK20	 ',1,'2020-03-21 12:43:05.807','2020-03-21 12:43:05.807')
,(62,'ULSD NY Harbor (May ''20)',' HOK20	 ',1,'2020-03-21 12:43:40.165','2020-03-21 12:43:40.165')
,(63,'Gasoline RBOB (May ''20)',' RBK20	 ',1,'2020-03-21 12:44:07.733','2020-03-21 12:44:07.733')
,(64,'Natural Gas (May ''20)',' NGK20	 ',1,'2020-03-21 12:44:50.719','2020-03-21 12:44:50.719')
,(65,'Crude Oil Brent (F) (May ''20)','QAK20	 ',1,'2020-03-21 12:45:14.071','2020-03-21 12:45:14.071')
,(66,'Ethanol Futures (May ''20)',' ZKK20	 ',1,'2020-03-21 12:45:42.340','2020-03-21 12:45:42.340')
,(67,'Corn (May ''20)',' ZCK20	 ',1,'2020-03-21 12:46:22.172','2020-03-21 12:46:22.172')
,(68,' Soybean (May ''20)',' ZSK20	',1,'2020-03-21 12:48:20.312','2020-03-21 12:48:20.312')
,(69,'Soybean Meal (May ''20)',' ZMK20	 ',1,'2020-03-21 12:48:47.657','2020-03-21 12:48:47.658')
,(70,'Soybean Oil (May ''20)','ZLK20	 ',1,'2020-03-21 12:49:14.251','2020-03-21 12:49:14.251')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(71,'Wheat (May ''20)','ZWK20	 ',1,'2020-03-21 12:49:54.226','2020-03-21 12:49:54.227')
,(72,'Hard Red Wheat (May ''20)',' KEK20	 ',1,'2020-03-21 12:50:14.664','2020-03-21 12:50:14.664')
,(73,'Spring Wheat (May ''20)','MWK20	 ',1,'2020-03-21 12:50:38.609','2020-03-21 12:50:38.609')
,(74,'Oats (May ''20)',' ZOK20	 ',1,'2020-03-21 12:50:58.301','2020-03-21 12:50:58.301')
,(75,'Rough Rice (May ''20)',' ZRK20	 ',1,'2020-03-21 12:51:22.786','2020-03-21 12:51:22.786')
,(76,'Canola (May ''20)',' RSK20	 ',1,'2020-03-21 12:51:45.608','2020-03-21 12:51:45.608')
,(77,'Cotton #2 (May ''20)',' CTK20	 ',1,'2020-03-21 12:52:30.482','2020-03-21 12:52:30.482')
,(78,' Orange Juice (May ''20)',' OJK20	',1,'2020-03-21 12:52:50.066','2020-03-21 12:52:50.066')
,(79,' Coffee (May ''20)',' KCK20	',1,'2020-03-21 12:53:17.900','2020-03-21 12:53:17.900')
,(80,'Sugar #11 (May ''20)','SBK20	 ',1,'2020-03-21 12:53:38.189','2020-03-21 12:53:38.189')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(81,' Cocoa (May ''20)','CCK20	',1,'2020-03-21 12:54:12.509','2020-03-21 12:54:12.509')
,(82,'Lumber (May ''20)','LSK20	 ',1,'2020-03-21 12:54:34.386','2020-03-21 12:54:34.386')
,(83,'Sugar #16 (May ''20)',' SDK20	 ',1,'2020-03-21 12:55:02.061','2020-03-21 12:55:02.062')
,(84,' Gold (Apr ''20)',' GCJ20	',1,'2020-03-21 12:57:50.347','2020-03-21 12:57:50.347')
,(85,'Silver (May ''20)',' SIK20	 ',1,'2020-03-21 12:58:11.595','2020-03-21 12:58:11.596')
,(86,'High Grade Copper (May ''20)',' HGK20	 ',1,'2020-03-21 12:58:34.609','2020-03-21 12:58:34.609')
,(87,'Platinum (Apr ''20)',' PLJ20	 ',1,'2020-03-21 12:58:56.290','2020-03-21 12:58:56.291')
,(88,' Palladium (Jun ''20)',' PAM20	',1,'2020-03-21 12:59:20.538','2020-03-21 12:59:20.538')
,(89,'Dow Jones Industrial Average',' DJI',0,'2020-03-21 13:03:58.700','2020-03-21 13:06:12.653')
,(90,'E-Mini Nasdaq 100 Index Jun 2020','NASDAQ 100 FT',1,'2020-03-21 13:16:05.613','2020-03-21 13:16:05.613')
;
INSERT INTO public."Product" (id,"name",code,status,"createdAt","updatedAt") VALUES
(91,'S&P 500 VIX Apr ''20 (VIJ20)','S&P 500 VIX',1,'2020-03-21 13:17:17.789','2020-03-21 13:17:17.789')
,(92,'CBOE Volatility Index (VIX)','CBOE VIX',1,'2020-03-21 13:18:25.895','2020-03-21 13:18:25.895')
;

/*Role*/


-- Drop table

-- DROP TABLE public."Role";

CREATE TABLE public."Role" (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Role_name_key" UNIQUE (name),
	CONSTRAINT "Role_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Role" (id,"name",status,"createdAt","updatedAt") VALUES
(1,'Administrador',1,'2020-02-22 11:43:19.643','2020-02-22 11:43:19.643')
,(2,'Regular',1,'2020-02-22 11:43:19.643','2020-02-22 11:43:19.643')
;

/*User*/

-- Drop table

-- DROP TABLE public."User";

CREATE TABLE public."Referral" (
	id serial NOT NULL,
 	"firstName" varchar(255) NULL,
 	"lastName" varchar(255) NULL,
 	email varchar(255) NULL,
 	"phoneNumber" varchar(255) NULL,
 	"country" varchar(255) NULL,
 	"city" varchar(255) NULL,
 	"jobTitle" varchar(255) NULL,
 	"initialAmount" numeric(10,2) NULL,
 	"hasBrokerGuarantee" int4 NULL,
 	"brokerGuaranteeCode" varchar(255) NULL,
 	"quantity" int4 NULL,
 	"personalIdDocument" bytea NULL,
 	"collaboratorIB" varchar(255) NULL,
 	"description" varchar(500) NULL,
 	"notes" varchar(500) NULL,
 	"userAccountId" int4 NULL,
 	status int4 NOT NULL,
 	"createdAt" timestamptz NOT NULL,
 	"updatedAt" timestamptz NOT null,
	CONSTRAINT "Referral_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"(id);

INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(3,'demo-001','','','','','$2b$10$2kToiMCD6tUOE6kXfsdmKe8ciBrHzUVKePNWFwsYF5oemsf6AP1fO','$2b$10$2kToiMCD6tUOE6kXfsdmKe','',NULL,NULL,2,1,'2020-02-27 22:40:35.628','2020-02-27 22:40:35.628')
,(5,'admin','Admin','Admin','122223333','admin@mailinator.com','$2b$10$2kToiMCD6tUOE6kXfsdmKexIRzDI4BSCOSGLRbM5Re1pHePMTMz4K','$2b$10$2kToiMCD6tUOE6kXfsdmKe','22334455',NULL,'2019-12-04 11:52:03.785',1,1,'2019-12-04 11:52:03.785','2020-03-02 19:31:23.778')
,(1,'laurens','Laurens','OB','122334455','laurens.ortiz@gmail.com','$2b$10$o53Iq7saTMsBtdhWy8JEtuiueTrofZ7vvSspMGCV5c0pwjSfpLLzO','$2b$10$o53Iq7saTMsBtdhWy8JEtu','89222731',NULL,'2020-02-24 22:32:51.000',2,0,'2020-02-24 22:33:03.179','2020-03-15 23:31:51.815')
,(8,'andres','Andres','Valerio','','sandresvp@gmail.com','$2b$10$PJuNIbTe6CMfK9CjuVxbXu1pHNia16oiOM7wMrqcJ4CHYIB6K.V.W','$2b$10$PJuNIbTe6CMfK9CjuVxbXu','',NULL,NULL,1,1,'2020-03-16 16:12:03.395','2020-03-16 16:12:03.395')
,(6,'demo-003','Demo','User','','sample@mailinator.com','$2b$10$4U1SFzfHazlzwvnC1R3XEOlXDUuassaFGPuFUCr/7JlnCgCMO8LWG','$2b$10$4U1SFzfHazlzwvnC1R3XEO','',NULL,NULL,2,0,'2020-03-02 19:33:56.479','2020-03-16 16:13:19.143')
,(2,'800000-demo','John','Doe','122334455','sample@mailinator.com','$2b$10$owPi2ho94MSCrorUZaUdKOD4h.sjb2pfO5ladOgCAu0dRVwhx9m0K','$2b$10$owPi2ho94MSCrorUZaUdKO','88997766',NULL,NULL,2,0,'2020-02-16 16:52:59.229','2020-03-16 16:13:29.318')
,(24,'anrams807810104','Andres Rafael ','Mejia Salazar','800497-ANRAM','rafical@gmail.com','$2b$10$YEgQRvYdrTfsCPnD.vSYxOmrFolFkpCGdVB/V9wt1tvW2JSUo36Gu','$2b$10$YEgQRvYdrTfsCPnD.vSYxO','',NULL,'2018-10-24 16:23:57.000',2,1,'2020-03-24 16:24:04.792','2020-03-24 16:24:04.792')
,(7,'karla01','Karla','Sandi Guevara','1-1084-0865','kharlitha04@gmail.com','$2b$10$gZE7VpHxKDGZlkckdbfaO.oZqiNfuplKDLPljbfmAT5qGtEg9Oaxu','$2b$10$gZE7VpHxKDGZlkckdbfaO.','+50671646455',NULL,'2020-02-27 12:23:38.000',1,0,'2020-02-27 12:39:58.441','2020-03-21 10:40:15.096')
,(4,'admin-001','','','','','$2b$10$2kToiMCD6tUOE6kXfsdmKexIRzDI4BSCOSGLRbM5Re1pHePMTMz4K','$2b$10$2kToiMCD6tUOE6kXfsdmKe','',NULL,NULL,1,0,'2020-02-27 22:43:13.325','2020-03-21 10:40:21.825')
,(10,'ksandig2020','Karla','Sandi','','kharlitha04@gmail.com','$2b$10$fZl5Mtn7FTb6nfXpQ3lWn.j4qFMEIpDXAz03EUo0bqRi8CwNl6gCK','$2b$10$fZl5Mtn7FTb6nfXpQ3lWn.','',NULL,'2020-03-21 10:44:11.000',1,1,'2020-03-21 10:44:34.681','2020-03-21 10:44:34.681')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(11,'plurivaega180781261','Abdon Plutarco ','Rivadeneira Egas','800761-PLURIVEGAS','abdonrivegas@hotmail.com','$2b$10$fZl5Mtn7FTb6nfXpQ3lWn.8Gz6gE.fKPNJfBjSexBCr107DLaifJu','$2b$10$fZl5Mtn7FTb6nfXpQ3lWn.','+593998003279',NULL,'2020-02-03 12:20:01.000',2,1,'2020-03-21 11:20:41.626','2020-03-21 11:20:41.626')
,(9,'cmorrales80095','Jennifer','Corrales','','jennifer02@gmail.com','$2b$10$74ReZrYruV7p/noAS8pXa.lym6xJjpADwdAjHg7fFJktrFX2jxwLK','$2b$10$74ReZrYruV7p/noAS8pXa.','88888888',NULL,'2020-03-16 16:27:29.000',2,0,'2020-03-16 16:27:39.277','2020-03-23 18:20:47.415')
,(13,'toshiaki180781090','Toshiaki Ruben ','Kono Ywasaki','800590-RYWASAKI','toshi.ruben@hotmail.com','$2b$10$OgaSP2TtrmmDp/4JXNBAzuAnmKKc6t.0e0gMLB4BBLYITFN6Rtj5C','$2b$10$OgaSP2TtrmmDp/4JXNBAzu','+595 983 698096',NULL,'2019-07-22 18:25:52.000',2,1,'2020-03-23 18:26:14.704','2020-03-23 18:26:14.704')
,(12,'aadamir180781301','Adolfo Adamir ','Alvarenga Lopez','800804-ALVARENGA','adolfoadamiralvarengalopez1980@gmail.com','$2b$10$fZl5Mtn7FTb6nfXpQ3lWn.IlILghZ1hiTYaww6dgwzFVP/q8Wj07i','$2b$10$fZl5Mtn7FTb6nfXpQ3lWn.','+502 5999 4116',NULL,'2020-02-20 12:44:55.000',2,1,'2020-03-21 11:45:18.600','2020-03-23 18:33:17.705')
,(14,'albamatutea807810131','Alba Elizabeth ','Matute Alvarado','800529-ELIMATUTEA','albieliza_88@hotmail.com','$2b$10$aHhH7zfAsIWBAN.oL1xSZuCYd63Z/iM9UZa2tPkeDYr0bnRZweT4q','$2b$10$aHhH7zfAsIWBAN.oL1xSZu','+593 93 985 9943',NULL,'2019-04-10 19:19:11.000',2,1,'2020-03-23 19:20:14.518','2020-03-23 19:20:14.518')
,(15,'alegueg180781085','Alejandro David ','Guevara Granja','800584-ALEDAGUE','aldavidguevara@hotmail.com','$2b$10$uHyfC8BcA8rHcJc6NWsBke7z.7W7LV1reLA6Kt6wU24t.VniV284u','$2b$10$uHyfC8BcA8rHcJc6NWsBke','',NULL,'2020-03-23 19:24:42.000',2,1,'2020-03-23 20:12:07.681','2020-03-23 20:12:07.681')
,(16,'alexbem180781093','Alex Ramiro ','Beltran Mendieta','800593-ALEXBELTRAN','alex_beltran@hotmail.com','$2b$10$uHyfC8BcA8rHcJc6NWsBkeafupzQ.vlhURk.ZkWwEC4Pegv2cJwr.','$2b$10$uHyfC8BcA8rHcJc6NWsBke','+593 99 347 2620',NULL,'2019-07-25 20:15:00.000',2,1,'2020-03-23 20:15:13.211','2020-03-23 20:15:13.211')
,(17,'alexca807810112','Alex Santiago ','Caguana Torres','800506-CAGUANA','alexcaguana@hotmail.es','$2b$10$uHyfC8BcA8rHcJc6NWsBkek96aFFagAzn9zNawOe3ovm9kfF5VqX2','$2b$10$uHyfC8BcA8rHcJc6NWsBke','',NULL,'2018-12-08 21:43:57.000',2,1,'2020-03-23 20:44:23.380','2020-03-23 20:44:23.380')
,(18,'alexaher180781124','Alexandra Del Rocio ','Hernandez Benalcazar','800625-ALEXAH','alexahernandez27@yahoo.es','$2b$10$U4bdVK5xh1rtfehjmJ3AaeoeFZPleh77Bqg9rVBqwabjglMCVneMC','$2b$10$U4bdVK5xh1rtfehjmJ3Aae','',NULL,'2019-09-17 21:24:40.000',2,1,'2020-03-23 21:25:46.631','2020-03-23 21:25:46.631')
,(19,'kimberly','Kimberly','Almendares','','','$2b$10$ZToBVAPWHdPCxQf.XaFFnOMj7AxGNkhPpj/tBSkbHWB08MjU0LpY.','$2b$10$ZToBVAPWHdPCxQf.XaFFnO','',NULL,NULL,1,1,'2020-03-24 15:07:58.128','2020-03-24 15:07:58.128')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(20,'jgalbe180781119','Alicia Breatriz ','Jimenez Guerron','800619-ALJIGUE','alicitabjm@hotmail.es','$2b$10$ZToBVAPWHdPCxQf.XaFFnOaiBP6pbHJGWnHZgtwn8wqFKDQua1TVi','$2b$10$ZToBVAPWHdPCxQf.XaFFnO','',NULL,'2019-09-11 15:15:14.000',2,1,'2020-03-24 15:15:44.581','2020-03-24 15:15:44.581')
,(21,'aquintero1807810154','Alvaro Javier ','Quintero Jurado','800552-QUINTERO','alvaroqjurado_1311@hotmail.com','$2b$10$YEgQRvYdrTfsCPnD.vSYxOkMFyFjh.Avbw31MP1g.v1u5yBLc9wAK','$2b$10$YEgQRvYdrTfsCPnD.vSYxO','',NULL,'2019-05-23 16:05:13.000',2,1,'2020-03-24 15:49:41.356','2020-03-24 16:05:23.720')
,(22,'ana80781087','Ana Lucia ','Alvarez Gordon','800476-ANA','analualvarez@hotmail.com','$2b$10$YEgQRvYdrTfsCPnD.vSYxOVyR5m.GS.c.w7Pav8FkJUO4ScevXL4O','$2b$10$YEgQRvYdrTfsCPnD.vSYxO','',NULL,'2018-08-07 16:07:20.000',2,1,'2020-03-24 16:08:13.463','2020-03-24 16:08:13.463')
,(23,'andreaf80781092','Andrea de Fatima ','Perrone Mendez','800481-AFP','andrea.perrone84@gmail.com','$2b$10$YEgQRvYdrTfsCPnD.vSYxOWFvtH02skNnIrZD822dA2f82REytXRm','$2b$10$YEgQRvYdrTfsCPnD.vSYxO','',NULL,'2018-08-08 16:10:46.000',2,1,'2020-03-24 16:11:18.987','2020-03-24 16:11:18.987')
,(25,'andrvla807810110','Andrés Vladimir ','Enriquez Pabón','800504-ANVLA','andres.enriquezp73@gmail.com','$2b$10$YEgQRvYdrTfsCPnD.vSYxOBniDw.1IAe1UDdNAGl0KXhKg02uFMI2','$2b$10$YEgQRvYdrTfsCPnD.vSYxO','',NULL,'2018-11-21 16:30:31.000',2,1,'2020-03-24 16:32:04.887','2020-03-24 16:32:04.887')
,(26,'afraferrer180781131','Angel Francisco ','Ferrer Pozos','800632-FERRERPO','angelferrer211261@gmail.com','$2b$10$YEgQRvYdrTfsCPnD.vSYxOxDwGJfU7hClrVOUPRNwinag09y5ulKi','$2b$10$YEgQRvYdrTfsCPnD.vSYxO','',NULL,'2019-09-27 16:35:25.000',2,1,'2020-03-24 16:35:42.298','2020-03-24 16:35:42.298')
,(27,'aracelly1807810165','Aracelly ','Villaroel Zerna','800564-AVILLA','aracelyv17@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.MQHiMFJ2pfhj8YkYfxILn0tItrwFv/q','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-06-13 08:20:04.000',2,1,'2020-03-25 08:21:05.374','2020-03-25 08:21:05.374')
,(28,'boarib807810109','Boris Alexander ','Rivadeneira Brito','800503-BOALEX','borisrivadeneirabrito@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.WGrrZxdU6/uVeAWinnQLdB2VSgoFCmW','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-11-16 08:42:43.000',2,1,'2020-03-25 08:43:02.370','2020-03-25 08:43:02.370')
,(29,'caeropc180781104','Carlos ','Caero Pezo','800604-CAEROC','carloscaero1947@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2./lVuJnotr0h/N0t2UKl/p6iHZOZANZ.','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-08-22 08:45:16.000',2,1,'2020-03-25 08:46:52.819','2020-03-25 08:46:52.819')
,(30,'caguachamin807810146','Carlos Ivan ','Guachamin Cabezas','800544-CARLOSGC','comisariatodeloslentes@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2./VGikh1n.w/FZaKznRsERo85jNYDhZ.','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-05-02 08:53:54.000',2,1,'2020-03-25 08:55:45.342','2020-03-25 08:55:45.342')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(31,'cmdaste807810101','Carlos Mauricio ','Daste Delgado','800493-CMD','mauricio_daste@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.EHVtC8PzDzKz8e5LOD8cAxOPheiHevO','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-09-18 08:59:38.000',2,1,'2020-03-25 08:59:46.856','2020-03-25 08:59:46.856')
,(32,'ccmc80781099','Cecilia Monica ','Cortez Broncano','800491-CCM','monicyb@yahoo.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.gdyHvKRt43KxFjb0gToDfugcc.umYgC','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-09-14 09:17:08.000',2,1,'2020-03-25 09:18:09.813','2020-03-25 09:18:09.813')
,(33,'solizce180781102','Cecilia ','Soliz Fuentes','800602-CSOLIZ','ce.soliz.73@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.JEC8QJAeKcS57FlhGm6zEJ/j2WhN9Vm','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-08-14 09:21:14.000',2,1,'2020-03-25 09:22:19.970','2020-03-25 09:22:19.970')
,(34,'cesarcf180781116','Cesar ','Caballero Flores','800616-CFCESAR','julcesarcab@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.W9Ftghzw.ERsq84DrkwSoq6qYM/JMDu','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-09-09 09:23:50.000',2,1,'2020-03-25 09:25:14.718','2020-03-25 09:25:14.718')
,(35,'cpe180781030','Christian ','Paul Enriquez','800469-CP','chtpel@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.9llvEg/PEIeMWOaejaBWiZYgE6mQpzO','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-08-08 09:26:29.000',2,1,'2020-03-25 09:27:27.105','2020-03-25 09:27:27.105')
,(36,'csortiz1807810184','Christian Santiago ','Ortiz Quintana','800582-SANTIOQ','santortiz2016@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.gOGYJjR8RyD2oDr7jLHHCZ9k.5JSFFS','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-07-08 09:28:57.000',2,1,'2020-03-25 09:29:45.035','2020-03-25 09:29:45.035')
,(37,'cristiandq1807810178','Cristian ','Duque Orozco','800576-CDUQUE','duqueorozcocristian@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.EPjTRdyl5/xXXqFtTtfnUnPpETABOuS','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-06-28 09:33:35.000',2,1,'2020-03-25 09:34:40.210','2020-03-25 09:34:40.210')
,(38,'aritaruiz180781118','Cuenta conjunta Arita-Ruiz','','800618-ARIRU','nelsonsaul@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.fEvDkNZNPggjbuAotmrE5hCMKYXDuT2','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-09-10 09:37:20.000',2,1,'2020-03-25 09:38:32.002','2020-03-25 09:38:32.002')
,(39,'maria','Maria ','Badilla','','','$2b$10$2jC5gjGh7.JH5FK2t/6g2.gkAHnm4wUraP0SIbzVkiC7PAUXFWa8K','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,NULL,1,1,'2020-03-25 09:45:29.435','2020-03-25 09:45:29.435')
,(40,'danielmt807810144','Daniel Jhony ','Mendoza Tapia','800542-DMENDOZA','mendozatapiadaniel@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.WDeOhfme7sVOASVOawZD036/QMkFEKq','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-05-01 09:44:45.000',2,1,'2020-03-25 09:46:14.266','2020-03-25 09:46:14.266')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(41,'davidaparra180781111','David ','Amores Parra','800611-DAMORES','d_amores9977@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.ofpqLoqHMOvyuD3VZVOTab87.s7/r8q','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-08-30 00:00:00.000',2,1,'2020-03-25 09:52:39.312','2020-03-25 09:52:39.312')
,(42,'daparedes1807810150','David Fabian ','Paredes Achupallas','800548-PAREDES','achuparedes@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.HcZi8/D1aVAv.biK8hJ1ElGf1kqU3l2','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-05-09 09:54:29.000',2,1,'2020-03-25 09:54:40.890','2020-03-25 09:54:40.890')
,(43,'dv18078994','Davis ','Morocho','800465-DM','dabism96@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.C.UDVaNGt6BEdsaP8kfFIeScI6rk2R2','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-08-08 09:57:30.000',2,1,'2020-03-25 09:58:51.240','2020-03-25 09:58:51.240')
,(44,'187106106rc','Demo','','800000-DEMO','','$2b$10$2jC5gjGh7.JH5FK2t/6g2.HPomHoZ2WItrJsezZQw3QH8gB2yhUja','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-01-29 10:02:01.000',2,1,'2020-03-25 10:02:17.721','2020-03-25 10:02:17.721')
,(45,'derivadeinera180781110','Dennis ','Rivadeneira Flores','800610-DRIVADENEIRA','deflores13@slb.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.72XTUZyZ.WFgygFbMysuI9rD3WjIV8O','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-08-30 10:04:11.000',2,1,'2020-03-25 10:05:11.455','2020-03-25 10:05:11.455')
,(46,'diegoa80781092','Diego Adrian ','Gutierrez Brito','800480-DGB','diegoagb_89@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.nsKu.HNh68wRA0me3Jl48Hhc6x9BSlS','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-08-08 10:09:40.000',2,1,'2020-03-25 10:11:09.617','2020-03-25 10:11:09.617')
,(47,'floreshd180781112','Diego Mauricio','Flores Herbas','800612-DFLORES','signdigo@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.Sk/bQ03vZdU.URo3kzep.udzxN6YAk2','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-09-03 10:14:20.000',2,1,'2020-03-25 10:17:06.175','2020-03-25 10:17:06.175')
,(48,'marticoro180781115','Diego Simon ','Martinez Coronel','800615-MARTINEZC','diego_m091@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.OzK2LXdTOsXXWHL2KwIjbfk6Lx.Ubjm','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-09-05 10:17:51.000',2,1,'2020-03-25 10:18:36.080','2020-03-25 10:18:36.080')
,(49,'eddymunoa180781144','Eddy Adan ','Muñoz Quicano','800644-MUNOAQ','eddymunoaquicano@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.R6TBvRvGJdlST9GK6YkNNh1Pe0fNJiG','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-10-17 10:20:33.000',2,1,'2020-03-25 10:21:33.325','2020-03-25 10:21:33.325')
,(50,'edvalla180781087','Edgar Erasmo ','Valladares Alvarez','800587-EDGARVA','edgarvalladares13@yahoo.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.j17qfiUYUeRFtr0qWXXQ1Vw/rAaE9Dq','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-07-12 10:24:52.000',2,1,'2020-03-25 10:25:54.974','2020-03-25 10:25:54.974')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(51,'educaba180781145','Eduardo Cesar ','Caballero Gallardo','800645-EDUCAB','educabaga_18@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.7ra5Mqea/FW/gV4OMM4QV553yvu2Mqi','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-10-17 10:42:04.000',2,1,'2020-03-25 10:43:03.934','2020-03-25 10:43:03.934')
,(52,'eduarpilla807810106','Eduardo Enrique ','Pillajo Caza','800500-EDUPICA','edupi2000@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.OIgNAK8XOlSeS7eblrX2fSIoV01nE5q','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-10-29 10:51:12.000',2,1,'2020-03-25 10:52:57.536','2020-03-25 10:52:57.536')
,(54,'eduvas8078989','Eduardo ','Vazquez','800589-EV','eduvastri@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.u70Sq4u9GKBezKVPSFv6exyTdVqb4OO','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-08-09 00:00:00.000',2,1,'2020-03-25 11:22:44.937','2020-03-25 11:22:44.937')
,(55,'edubritoc807810116','Eduardo Vinicio ','Brito Carvajal','800511-EDUBRITO','ebritoc54@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.BOgFTRsdM6MHs2wxR69PzzvEq//ozKO','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-02-05 11:28:23.000',2,1,'2020-03-25 11:30:23.575','2020-03-25 11:30:23.575')
,(56,'eduvipa1807810167','Edwin Vinicio ','Panchi Teran','800566-ETERAN','edwin.panchi@yahoo.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.6mkzF9ZCpQAkUBCJ2sPvclwm1SqmKJ.','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-06-19 11:33:40.000',2,1,'2020-03-25 11:36:04.158','2020-03-25 11:36:04.158')
,(57,'elviamin180781086','Elvia Cecilia ','Minchala Buri','800586-CECIMINCHAL','ceciari2016@outlook.es','$2b$10$2jC5gjGh7.JH5FK2t/6g2.aEU8vhXyOlPBZoqD60J56aa9GxQ/Bzm','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-07-12 11:42:01.000',2,1,'2020-03-25 11:43:25.039','2020-03-25 11:43:25.039')
,(53,'ebritocarva807810116','Eduardo V. ','Brito C.','800524-EDUBCARVA','ebritoc54@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.t2eUuw5ejweEPt69BwChSwRtNf6k2CO','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-03-27 10:54:02.000',2,0,'2020-03-25 11:12:35.153','2020-03-25 11:44:31.558')
,(58,'ercinavas180781129','Ercilia Nohelia ','Navas Hernandez','800630-NOHENAVAS','ercinavas80@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.yTJgs7iVlxWz5WJKwAX7OBkLsvhtO5C','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-09-25 11:46:43.000',2,1,'2020-03-25 11:48:29.706','2020-03-25 11:48:29.706')
,(59,'fgalves180781137','Fabian ','Guillen Alves','800638-FALVES','fabian.galves@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.roUlkMuHzTQ/PVG.o6T3YrDBkMNUVFu','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-10-02 11:54:33.000',2,1,'2020-03-25 11:55:47.791','2020-03-25 11:55:47.791')
,(60,'vacanielfr180781121','Fabio Reynaldo ','Vacaniel Alarcon','800621FABIOVA','fabiovacanielalarcon@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.mUibUefXdI7.fwrJNkjFwRouGf/d2wS','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-09-13 00:00:00.000',2,1,'2020-03-25 11:58:53.981','2020-03-25 11:58:53.981')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(61,'fnavarrete1807810153','Fanny ','Navarrete Guerron','800551-FANAVARRETE','navarretefanny299@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.VSiDZ5Bg.nMj0o04ceHcW9X8CqpIgEe','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-05-16 12:02:38.000',2,1,'2020-03-25 12:03:39.819','2020-03-25 12:03:39.819')
,(62,'fragomezta807810126','Francisco ','Gomez de la torre Andrade','800521-FRANGTOAN','franciscog81@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.CsYjHpmTA54d9PPGAz9OdE36Nevg8Ny','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-03-22 12:10:04.000',2,1,'2020-03-25 12:13:03.462','2020-03-25 12:14:27.934')
,(63,'franjami807810107','Francisco Javier ','Gonzalez Mieles','800501-FRANMI','ecuinvestgrp@outlook.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.idhX0ybr1IaWAP5wb9Kvf5oe/jX3dZm','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-11-03 12:17:44.000',2,1,'2020-03-25 12:18:27.564','2020-03-25 12:18:27.564')
,(64,'fs180781021','Franklin Santiago ','Iza Iza','800468-FS','santiiza@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.pM97xAQwqkVWkUIksa01AhAdmrmCzbi','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-08-11 12:27:43.000',2,1,'2020-03-25 12:27:57.142','2020-03-25 12:27:57.142')
,(65,'gsb80781097','Gabriel Santiago ','Bautista Herrera','800489-GSB','tiagobauher@icloud.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.FKTUlwinFtupbBmKvlEjNvNc..WQY46','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2018-09-06 12:41:00.000',2,1,'2020-03-25 12:42:32.931','2020-03-25 12:42:32.931')
,(66,'ganavag180781094','Galo Anibal ','Navarrete Guerron','800594-GANIBAL','galo1navag75@gmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.DX/YanNTSihQwlnCYBD0uzvrlEAwRBO','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-07-25 12:43:45.000',2,1,'2020-03-25 12:44:48.277','2020-03-25 12:44:48.277')
,(67,'galcarre807810115','Galo Eustorgio ','Carrera Lopez','800509-GALPEZ','galocarreral@hotmail.com','$2b$10$2jC5gjGh7.JH5FK2t/6g2.PdjchrSVD2d7.YLizQuZ2mIAWvwnYSW','$2b$10$2jC5gjGh7.JH5FK2t/6g2.','',NULL,'2019-01-17 12:46:19.000',2,1,'2020-03-25 12:47:42.078','2020-03-25 12:47:42.078')
,(68,'gaudenela180781132','Gaudencio Ela ','El a Andeme','800633-GAUELAEL','gaudencio.ela@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.wNcp/tojyl6gL/2Jk/VTAXABwRPh8b2','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-27 13:56:09.000',2,1,'2020-03-25 13:58:12.102','2020-03-25 13:58:12.102')
,(69,'gms8078990','German ','Sanabria','800582-GS','germansanabriamolina@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.WxCAAeRKHRcngf6xZWPg32sr21Ju5pS','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-25 14:01:29.000',2,1,'2020-03-25 14:03:03.466','2020-03-25 14:03:03.466')
,(94,'jennifer','Jennifer','Ramirez','','','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.hPtASwC.PdN8xw5rA8bb49uOcJtD25e','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,NULL,1,1,'2020-03-25 16:10:33.557','2020-03-25 16:10:33.557')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(70,'gersonm18018179','Gerson ','Montaño Patty','800577-GMPATTY','gersonmp2012@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.wK9W.fmMKYBq6EKuzMChWd9g0Oodvii','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-06-28 14:05:08.000',2,1,'2020-03-25 14:06:03.583','2020-03-25 14:08:46.086')
,(71,'giovana1807810175','Giovana ','Quispe Cuizara','800573-GQUISPE','giovanaqc1@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.plxP7Z2.A4v26OXfhLcHKwLQYoX42xi','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-06-25 00:00:00.000',2,1,'2020-03-25 14:14:44.633','2020-03-25 14:14:44.633')
,(72,'gdenisse180781139','Gisela Denisse ','Becerra Farfan','800639-GIFARFAN','gisellabecerrafarfan@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.28UY49hHAbfqHnGMJeEQ/LfJHM1SDPq','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-10-04 14:45:47.000',2,1,'2020-03-25 14:46:01.739','2020-03-25 14:46:01.739')
,(73,'gevalerioa807810122','Guirliany ','Valerio Araya','800517-GUIRVALEA','guirliany@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.ia0oB0gnFFjImKt1gCBmPDaYg98HTyq','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-03-20 14:47:08.000',2,1,'2020-03-25 14:47:52.037','2020-03-25 14:47:52.037')
,(74,'gsolarteama8078140','Gustavo',' Solarte Amaya','800538-GSOLARTE','gsolarte695@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.ONT1ymGZvzmOMuFNxe6qlSBMx6GTenK','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-04-29 14:49:26.000',2,1,'2020-03-25 14:50:01.419','2020-03-25 14:50:01.419')
,(75,'hjocede807810145','Hector Jose',' Cedeño S','800543-HCEDEÑO','hectorcedeno01@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.n6s83qf4dRqWMv2ZK1XOmwS.iM2QBIa','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-05-02 15:02:42.000',2,1,'2020-03-25 15:03:10.585','2020-03-25 15:03:10.585')
,(76,'hildacp180781101','Hilda Aracely ','Cruz Portillo','800601-HCRUZ','cruzhilda042@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.J5SyY79HSJrOLdtxypJ4qE6nqenJ9NW','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-08-13 15:07:49.000',2,1,'2020-03-25 15:08:39.390','2020-03-25 15:08:39.390')
,(77,'holgerbc807810118','Holger Omar ','Barrionuevo Camacho','800513-HOMARBC','omar161992@outlook.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.Mijf.ypc9SOn3lwuqLDOoWMERpEJM3q','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-02-15 15:09:54.000',2,1,'2020-03-25 15:11:03.151','2020-03-25 15:11:03.151')
,(78,'inariasp180781103','Ingrid Maria Anayda ','Arias Pareja','800603-IARIAS','ingridmariasp@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.vdaPbxeCOkh5yu0y4DE9kOfeKCbCJ82','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-08-14 15:13:05.000',2,1,'2020-03-25 15:14:05.228','2020-03-25 15:14:05.228')
,(79,'javierza180781095','Javier Francisco ','Fernandez Zapico ','800595-FFZAPICO','frajaferza@yahoo.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.3yQ4PPxuUIOaTEJwHPH7kGtVIFlX4xq','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-07-29 15:16:11.000',2,1,'2020-03-25 15:17:35.069','2020-03-25 15:17:35.069')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(80,'jenquispw180781152','Jenny Rosmery ','Quispe Oblitas','800652-OBLIQUIS','jennyqobol@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.GGcmvritdmRn5LW/lilCI2jNSTUz0F6','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-11-01 15:19:50.000',2,1,'2020-03-25 15:20:46.797','2020-03-25 15:20:46.797')
,(81,'garjh180781120','Jesus Hernan ','García Castillo ','800620-JESUSG','jesus_h_garcia@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.YOaJQXvfrKBk5mimpm0.28sAHywVLOC','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-12 15:23:00.000',2,1,'2020-03-25 15:25:46.058','2020-03-25 15:25:46.058')
,(82,'callaojesus180781117','Jesus Reynaldo ','Callao Rosales','800617-JRCALLAO','info@gktelbolivia.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.Lcmebpgwu5LP3au6Oo991f4SGYANqxm','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-09 00:00:00.000',2,1,'2020-03-25 15:27:43.611','2020-03-25 15:27:43.611')
,(83,'acevedoja180712223','John Arturo ','Acevedo Guerrero','800557-ACEVEDO','johnacegue@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.srU5cm2JMqo83tL3qdrVyW6LzRt83xK','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2020-01-09 15:32:00.000',2,1,'2020-03-25 15:32:33.713','2020-03-25 15:32:33.713')
,(84,'johnava807810123','John ','Valerio Araya','800518-JOHNAVALE','javacuatro@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.Pdca.SYp6A7ywlJ9s7ygNC0HFniyFo2','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-03-20 15:34:57.000',2,1,'2020-03-25 15:36:27.939','2020-03-25 15:36:27.939')
,(85,'jleonel1807810176','Jorhan Leonel ','Martinez Gaitan','800574-JORHANM','jorhan.leonel10@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.Z3aA9bd4ZShbg0u536.c55lHrjDYeXO','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-06-26 00:00:00.000',2,1,'2020-03-25 15:40:46.304','2020-03-25 15:40:46.304')
,(86,'jose80781090','Jose Alfredo ','Lopez Reinoso','800479-JLR','lopezq2001@yahoo.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.kQyPN9K8hZXukSeX1QmQoFEY07xWpk2','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-11 00:00:00.000',2,1,'2020-03-25 15:46:02.454','2020-03-25 15:46:02.454')
,(87,'joseanrr180781143','Jose Angel ','Rodriguez Reinoso','800643-JOSEANGEL','jreino1986@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.CQlo.8iSOOYyBeHJNE3Z0ElU563V7y2','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-10-14 00:00:00.000',2,1,'2020-03-25 15:50:11.838','2020-03-25 15:50:11.838')
,(88,'jre180781085','Jose Ruben ','Enriquez Pabon ','800474-JRE','jre.enriquez@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.YZy1xAKkIKlu6nMa0HFYiNzVZ8O10pm','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-11 00:00:00.000',2,1,'2020-03-25 15:53:47.887','2020-03-25 15:53:47.887')
,(89,'josearitas807810127','Jose Saul ','Arita Salvador','800523-JOSARITAS','sas@coddep.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.ipxAKXQiUqDAws9IxLHnx1Bu2iB3G06','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-03-26 00:00:00.000',2,1,'2020-03-25 15:56:15.823','2020-03-25 15:56:15.823')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(90,'jcfernandez1807810152','Juan Carlos','Larrosa Fernandez','800550-JCLARROSA','juanlarrosa0105@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.Qta4GGgsFNQIDAH42EVQko7DvnYSby6','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-05-14 00:00:00.000',2,1,'2020-03-25 15:59:36.968','2020-03-25 15:59:36.968')
,(91,'jmc180781035','Julia Marlene ','Carrera Zanafria','800470-JC','julimcarrez@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.mbRx01SnVW5jP0f04XoOJjtCdw.SAZe','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-11 00:00:00.000',2,1,'2020-03-25 16:02:40.149','2020-03-25 16:02:40.149')
,(92,'aguilera180781108','Julio Cesar ','Aguilera Camacho','800608-JAGUILERA','julio_c_aguilera@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.il6ZxXBiVtNkxUJeOgRaKDXtqMxXVOa','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-08-27 00:00:00.000',2,1,'2020-03-25 16:05:23.783','2020-03-25 16:05:23.783')
,(93,'jm18078993','Julio ','Cesar Martinez','800464-JM','juliomart512@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.9qCShyen5iiXBMPT4vtmhK3oFBFSVCW','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-11 00:00:00.000',2,1,'2020-03-25 16:08:20.383','2020-03-25 16:08:20.383')
,(95,'kaguzmant807810134','Karen Dimelza ','Guzman Torrez','800532-KAGTORREZ','karendimelzaguzman@outlook.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.GUATSyPRwgGKwyfsdPP9kmRWgUF22k2','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-04-16 00:00:00.000',2,1,'2020-03-25 16:10:38.979','2020-03-25 16:10:38.979')
,(96,'leocastro180781106','Leonidas Mario ','Castro Fajardo','800606-LCRUZF','lemacafa@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.1AbAr7FyUKosGoHvO/GBYB27BgvUrB2','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-08-27 00:00:00.000',2,1,'2020-03-25 16:14:18.967','2020-03-25 16:14:18.967')
,(97,'lizmp80781093','Lizbeth Ivonne ','Muñoz Pazmino','800485-LIZ','lmunozpazmino@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.ALp2USm7f0lV37E36vDptWoWOhJkE4u','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-14 00:00:00.000',2,1,'2020-03-25 16:18:55.853','2020-03-25 16:18:55.853')
,(98,'morenonl180781122','Lorena de la Gracia ','Moreno Navarrete','800623-MORENO','lorenmoren70_@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.JR8S2nkVjFNasUP1xZTZTuKz9PyCyXe','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-14 00:00:00.000',2,1,'2020-03-25 16:23:10.170','2020-03-25 16:23:10.170')
,(99,'allumiguano1807810158','Luis Alberto ','Llumiguano','800556-LLUMIGUANOG','luisbetoll7@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.k7v2xRh1YXv0bZFAqpmilG00lURiGzq','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-05-31 00:00:00.000',2,1,'2020-03-25 16:25:32.079','2020-03-25 16:25:32.079')
,(100,'luasalazarp807810125','Luis Alberto ','Salazar Pillajo','800520-LUASAPILLAJO','lasp1757@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.LqtnpNbyWpHZwAUJK7scaFWCxbH7Iz6','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2020-01-03 16:27:31.000',2,1,'2020-03-25 16:28:34.602','2020-03-25 16:28:34.602')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(101,'lfmartinez1807810181','Luis Felipe ','Martinez Llivicura','800579-LUISFM','economia_099@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.8PDdsfQ.qLSKAGbf5q8CWUZ/kvDMc9u','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-07-02 00:00:00.000',2,1,'2020-03-25 16:32:22.250','2020-03-25 16:32:22.250')
,(102,'luisfmv180781142','Luis Francisco ','Martinez Villalba','800642-MARVILLA','pacomavi07@yahoo.es','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.kEIxe.lrzz4brQME1Hu.Gw372oWeNq6','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,NULL,2,1,'2020-03-25 16:34:51.343','2020-03-25 16:34:51.343')
,(103,'luispadi80781097','Luis Marcelino ','Patiño Diaz','800597-LPATINO','pochitohmetro@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.LkbZ0uYEyN1hPI0CfY7UPGeyoYz3d8K','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-08-07 00:00:00.000',2,1,'2020-03-25 16:38:09.732','2020-03-25 16:38:09.732')
,(104,'marameau180781099','Luis Marcelo ','Rameau Fortunatto','800599-RAMEAU','rameaumarcelo78@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.F.s8bbAa0vos0Hk/rFQMI.22Mts11xO','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-08-09 00:00:00.000',2,1,'2020-03-25 16:41:28.101','2020-03-25 16:41:28.101')
,(105,'talicaceres180781134','Manoela Anatalicia ','Caceres Caceres','800635-MANOCA','talicaceres@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.posly8K9nmElCd3giUJWWAXLuGR7c4G','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-10-01 00:00:00.000',2,1,'2020-03-25 16:43:26.185','2020-03-25 16:43:26.185')
,(106,'augupv180781109','Manuel Augusto ','Peralta Valarezo','800609-AUPEVA','augusto4_peralta@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.1AGXud/JV.woIUsPTOXKNEg4Bww3TWG','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-08-28 00:00:00.000',2,1,'2020-03-25 16:47:42.153','2020-03-25 16:47:42.153')
,(107,'marcelops180781133','Marcelo ','Pastor Sanchez','800634-PASTORS','marcelo39pastor@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.E3kL3U1HejxiX3JTcJezMAx/iO740U6','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-27 00:00:00.000',2,1,'2020-03-25 16:54:08.945','2020-03-25 16:54:08.945')
,(108,'mc180781019','Marco Antonio ','Carrera Quintana','800466-MC','marco.carrera12@yahoo.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.bcG.ebDA8ak7fg8vtRNi4.7NrwdyK6q','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-14 00:00:00.000',2,1,'2020-03-25 16:56:24.403','2020-03-25 16:56:24.403')
,(110,'gaibormm180781147','Marco David ','Gaibor Melo','800647-GAIBORM','dr.marcogaibor@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.QT4U7o4nOcSzQKdUMQX/yk26Pwjo75e','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-10-21 00:00:00.000',2,1,'2020-03-25 16:59:12.464','2020-03-25 16:59:12.464')
,(114,'mariapico180781128','Maria Berthilia ','Pico Alvear','800629-PICOMB','berthipico@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.72H3v8UQ9apiIR8rDwLCp2dlK77VU9K','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-23 00:00:00.000',2,1,'2020-03-25 17:07:23.795','2020-03-25 17:07:23.795')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(115,'mapi80789900','Maria Elene ','Pinaya','800591-MP','mariaelenapinaya@yahoo.es','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.1f7oPm5hYaqOAzgQtijfORnqoO5OIra','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-14 00:00:00.000',2,1,'2020-03-25 17:09:05.812','2020-03-25 17:09:05.812')
,(116,'mariapeg180781113','Maria Gabriela ','Peña Guevara','800613-PEMARIA','gabyimport@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.KGfALvJwaAs2A4Leh./ZQgjfFWQuPNm','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-14 00:00:00.000',2,1,'2020-03-25 17:13:26.317','2020-03-25 17:13:26.317')
,(117,'maritrianas807810118','Maria Isabel ','Triana Suarez','800527-MISABELTRI','maistri29@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ./xHospx.XCwfhT1D6JGKCrLrdzSzkIu','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-04-04 00:00:00.000',2,1,'2020-03-25 17:15:55.130','2020-03-25 17:15:55.130')
,(118,'msalazar1807810174','MARISOL ','SALAZAR RUCK','800572-MARISOL','marisolruck102@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.m1hwsnsFSsm2CN/fG6DE0LjEyPMUD6W','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-06-25 00:00:00.000',2,1,'2020-03-25 17:19:41.832','2020-03-25 17:19:41.832')
,(119,'mawall807810103','Mauro Waldemar ','Villacres Obregon','800495-MWALL','maurovil567@icloud.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.SGxLnliLcypGubfkM0T3DPAJ2xiWgr6','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-10-24 00:00:00.000',2,1,'2020-03-25 17:22:34.118','2020-03-25 17:22:34.118')
,(120,'mforesvega180781130','Miguel Alejandro','Fores Vega','800631-FORESVEGA','mifores2@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.I.GfokldYF3KzOGMohP9Besg1boojri','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-25 00:00:00.000',2,1,'2020-03-25 17:24:16.122','2020-03-25 17:24:16.122')
,(121,'mdc80781086','Mirian Del Carmen ','Bayas Rea','800475-MDC','mbayasr5@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.is0W7Lki.Kv8Xho2JzkhNHmqxhxnDxy','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-14 00:00:00.000',2,1,'2020-03-25 17:28:23.584','2020-03-25 17:28:23.584')
,(122,'moisescolq180781127','Moises ','Colque Conde','800628-MCOLQUE','moisesmoi1251@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.uGi.M4OAzSqEncENMQckR9v6wYqDzUW','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-23 00:00:00.000',2,1,'2020-03-25 17:32:45.038','2020-03-25 17:32:45.038')
,(123,'nfranruiz807810124','Nahun Francisco ','Ruiz Serrano','800519-NARUIZSERRA','ruizlesly05@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.it0EoRhJ9nbCDzsnujp1EwT32OLqBkC','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-03-20 00:00:00.000',2,1,'2020-03-25 17:37:58.654','2020-03-25 17:37:58.654')
,(124,'nancycha180781126','Nancy ','Chavez de Gutierrez','800627-NANGUT','nancychavezgutierrez77@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.aTCDFjJzfveWznnDwVpJ5WLEkC206iu','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-20 00:00:00.000',2,1,'2020-03-25 17:40:01.792','2020-03-25 17:40:01.792')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(125,'natharosero807810130','Nathaly Rocio ','Rosero Nicolalde','800528-NAROSERONI','na_thy_r@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.jRWJsUg8TX3wWkX8hfNGICG6/8PKGkm','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-04-08 00:00:00.000',2,1,'2020-03-25 17:42:48.608','2020-03-25 17:42:48.608')
,(126,'neruizse807810117','Nelson A.','Ruiz Serrano','800512-NRSERRA','nelars67@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.alyVXp0BMM4ieUah1dyZreY2plWyuVW','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-02-13 00:00:00.000',2,1,'2020-03-25 17:46:34.816','2020-03-25 17:46:34.816')
,(127,'nijudithca807810135','Ninoska Judith ','Caero Adrian','800533-NJCAEROA','ninoskajudithcaero@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.IiuG0On9oWZYx4xTbOyjcfOXXdilWaa','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-04-17 00:00:00.000',2,1,'2020-03-25 17:48:43.796','2020-03-25 17:48:43.796')
,(128,'olgamb807810121','Olga Marina ','Barahona Hercules','800516-OLGABAHE','omatam20@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.TnDYWlSYyVcCTmC0wU7N9GwQPQjF0h6','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-03-19 00:00:00.000',2,1,'2020-03-25 17:50:47.960','2020-03-25 17:50:47.960')
,(129,'omarviva1807810148','Omar R ','Vivanco','800546-OMARUIZ','oaruviva@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.Px5nOCYtEX3Ra2bxxt1/sPY8qY3N6vO','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-05-07 00:00:00.000',2,1,'2020-03-25 17:55:15.519','2020-03-25 17:55:15.519')
,(130,'orp8078987','Oscar Ruben ','Pavon','800592-OP','oscarrubenpavon@gmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.rqMdbg00.ft3VRqNV4DEya4wv6P6wP2','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2018-08-22 00:00:00.000',2,1,'2020-03-25 17:57:30.355','2020-03-25 17:57:30.355')
,(131,'vainerpa180781114','Pablo Mauricio ','Vainer Apolito','800614-PVAINER','pvainer@me.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.wcQjL7WsYN69O0fTXxT69s2Gt/Df2Ki','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-09-04 00:00:00.000',2,1,'2020-03-25 18:00:22.678','2020-03-25 18:00:22.678')
,(132,'paumoreno180781089','PAULINA DEL CONSUELO ','MORENO PEREZ','800589-PMORENOP','paulabella71@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.amjbUrBSVFAlyCd3NNgPUGXR2Ny8qzu','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-07-22 00:00:00.000',2,1,'2020-03-25 18:03:52.240','2020-03-25 18:03:52.240')
,(133,'pedror1807810172','Pedro Eduardo ','Rosero','800570-PROSERO','na_thy_r@hotmail.com','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.Dp.vLdbaxkRDRkAztPKl6pEpf0pmq06','$2b$10$MZ/.NPWc2v.km/VrmS5GQ.','',NULL,'2019-06-24 00:00:00.000',2,1,'2020-03-25 18:05:45.128','2020-03-25 18:05:45.128')
,(134,'rafavela807810120','Rafael ','Velazo ','800515-RAFAVELA','rafavela@outlook.com','$2b$10$nkwnFUO46Po/lSEQAPhvre4LCfDZxOY09B0Bvj0amephNDtLJo0cy','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-03-05 00:00:00.000',2,1,'2020-03-26 08:03:45.189','2020-03-26 08:03:45.189')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(135,'rs180781020','Rodrigo ','Roca Serrano','800467-RR','rodroca@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvre/mfjR.0wTapGUXKhbzXWW9NNWc.Zlkm','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2018-08-22 00:00:00.000',2,1,'2020-03-26 08:06:20.341','2020-03-26 08:06:20.341')
,(136,'roferf80781094','Roly ','Fernandez Flores','800486-RLY','rolyfern92@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreYM2dQYerrDBCAcQsa7UjhySTbcOdBwm','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2018-08-22 00:00:00.000',2,1,'2020-03-26 08:08:13.213','2020-03-26 08:08:13.213')
,(137,'rwcf807810100','Romulo William ','Chipantiza Fernandez','800492-FERC','ferchiza1969@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvre6jGPY3l1A.JN1ZFvjPnT45Ln1UYpG/O','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2018-09-14 00:00:00.000',2,1,'2020-03-26 08:12:49.007','2020-03-26 08:12:49.007')
,(138,'rosapineda1807810155','Rosa Elena ','Pineda Amaguaña','800553-RPINEDA','hostalosandes@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvregPPlhOoTTjuz5SsVPIyKHo.rEgG3UPy','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-05-28 00:00:00.000',2,1,'2020-03-26 08:14:56.531','2020-03-26 08:14:56.531')
,(139,'rmn180781081','Rosa Margarita ','Navas Lavaire','800473-RMN','rosanavas1972@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrecDOGPlXyGQqcFmXZc7K4eA6bwNenkPC','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2018-08-22 00:00:00.000',2,1,'2020-03-26 08:17:24.414','2020-03-26 08:17:24.414')
,(140,'cecipalacios1807810151','Rosario Cecilia ','Palacios Burbano','800549-CPALACIOS','draceciliapalacios@outlook.com','$2b$10$nkwnFUO46Po/lSEQAPhvreiONfYHMdUzwEr4Yq8aTT7.RGBExeWKC','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-05-13 00:00:00.000',2,1,'2020-03-26 08:19:09.992','2020-03-26 08:19:09.992')
,(141,'orihuelar180781151','Sandra ','Orihuela Ruiz','800651-SANORI','sndrorihuela@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreRfsDPuGnZZswHlQGZT7uyVL9izZdrri','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-10-24 00:00:00.000',2,1,'2020-03-26 08:22:45.035','2020-03-26 08:22:45.035')
,(142,'santpo807810111','Santiago Daniel ','Sanchez Ponce','800505-SANCHEZPO','santiagosanchez36@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreLLgvsIL/DlQuu.nfJed8994xmXNcXky','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2018-12-08 00:00:00.000',2,1,'2020-03-26 08:24:34.573','2020-03-26 08:24:34.573')
,(143,'vacalvarez180781141','Santiago Jose ','Vaca Alvarez','800641-VACASANT','santilobo1080@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreTVN7T77S.4XeOH/vmZ5VzpkVp8QJWTi','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-10-09 00:00:00.000',2,1,'2020-03-26 08:26:14.433','2020-03-26 08:26:14.433')
,(144,'sc18078993','Sonia Guadalupe ','Carrera Guadalupe','800461-SCQ','soniacarrera@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreNTM4aXKUZ1EWd8vzVkV29/iDyJYI42.','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2018-08-25 00:00:00.000',2,1,'2020-03-26 08:28:17.901','2020-03-26 08:28:17.901')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(145,'sc18078992','Sonia Guadalupe ','Carrera Guadalupe','800461-SC','sonia_carre@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreNTM4aXKUZ1EWd8vzVkV29/iDyJYI42.','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2018-08-25 00:00:00.000',2,1,'2020-03-26 08:29:59.079','2020-03-26 08:29:59.079')
,(146,'ssanabria180781140','Sonia Noelia ','Sanabria Recalde','800640-SNOELIASA','soniarecalde83@yahoo.com','$2b$10$nkwnFUO46Po/lSEQAPhvre5av1xZILek5GH/6jQ.pYz2Uqww1W4e.','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-10-04 00:00:00.000',2,1,'2020-03-26 08:31:28.894','2020-03-26 08:31:28.894')
,(147,'smz180781075','Susana Marlene ','Zanafria Cardenas','800471-SZ','susan.zanafria@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvredLuL01cQbEiXLBfAQ1diGe/TJQix9kW','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2018-05-25 00:00:00.000',2,1,'2020-03-26 08:33:20.735','2020-03-26 08:33:20.735')
,(148,'oliveira180781136','Valdenira ','de Oliveira','800637-DOLIV','deval-mim@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrehjQ258Eq05c2ZxMxuDFC.GHZnvCg0xy','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-10-02 00:00:00.000',2,1,'2020-03-26 08:36:35.083','2020-03-26 08:36:35.083')
,(149,'vrincon1807810164','Valen Richar ','Martinez Rincon','800563-VALENR','valenmartinez@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrelhDZSg3wdP59dfSLzy.a31S78WI2A/O','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-06-13 00:00:00.000',2,1,'2020-03-26 08:39:03.545','2020-03-26 08:39:03.545')
,(150,'villegaszv180781149','Victor Ivan ','Villegas Zeballos','800649-VICTORVZ','vicoiv@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreQutBwWKZRRAWvTQlemlpFub3.OmbCOW','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-10-23 00:00:00.000',2,1,'2020-03-26 08:40:52.816','2020-03-26 08:40:52.816')
,(151,'victormier180781146','Victor Manuel ','Mier Sanchez','800646-MIERSV','victorms1@puntonet.ec','$2b$10$nkwnFUO46Po/lSEQAPhvrerwiGdchYO/8qMamDfIcbVEzqXruy1H6','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-10-18 00:00:00.000',2,1,'2020-03-26 08:42:59.853','2020-03-26 08:42:59.853')
,(152,'wiguillen1807810149','William ','Guillen','800547-WILLIAMG','will.galves@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreFXtcLwIZ9ZiNJBAKO87LBmr6WXl9xxm','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-05-08 00:00:00.000',2,1,'2020-03-26 08:44:43.061','2020-03-26 08:44:43.061')
,(153,'monica','Monica','Medina','','','$2b$10$nkwnFUO46Po/lSEQAPhvreAvWz9rA5Hnwph/RdHJUFqsBopx5sx5y','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,NULL,1,1,'2020-03-26 08:50:16.174','2020-03-26 08:50:16.174')
,(154,'patricia','Patricia','','','','$2b$10$nkwnFUO46Po/lSEQAPhvreAvWz9rA5Hnwph/RdHJUFqsBopx5sx5y','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,NULL,1,1,'2020-03-26 08:51:05.402','2020-03-26 08:51:05.402')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(155,'joczanafria180781155','Jorge Luis ','Carrera Zanafria','800655-JOCARREZA','jlcarreraz@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreX08qaxiMkF0vWfjXPB7XMSD1U3ZbO6G','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-07 00:00:00.000',2,1,'2020-03-26 08:53:17.340','2020-03-26 08:53:17.340')
,(156,'vargasange180781157','Angelica Maria ','Vargas Gomez','800657-ANGEVG','anmavago14@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrelB0S5vQELKG/qQGa2Jvqgvo5v1BYvlm','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-11 00:00:00.000',2,1,'2020-03-26 08:58:03.609','2020-03-26 08:58:03.609')
,(157,'manueles180781159','Nelson ','Manueles Teruel','800659-TERUELM','nelson.teruel84@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreXswgfbWSsdfBV8ieGXM0wTwnaUxmvVq','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-13 00:00:00.000',2,1,'2020-03-26 09:01:22.746','2020-03-26 09:01:22.746')
,(158,'lnelsonjac180781160','Luis Nelson ','Jacquet Olmedo','800660-JACQUETO','nelsonjac22@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreyX6NlDiv2b6dnX0GsnRvIbp2.7v3tZG','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-13 00:00:00.000',2,1,'2020-03-26 09:03:00.712','2020-03-26 09:03:00.712')
,(159,'acardol180781161','Alberto Fabian ','Cardozo Lopez','800661-CARDOLOPEZ','fabi.car13@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvre/HM3dB.IMXLep3/ECBUUoNqqIbjMfMu','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-13 00:00:00.000',2,1,'2020-03-26 09:05:24.286','2020-03-26 09:05:24.286')
,(160,'garsala180781162','Arnulver Alberto ','Garcia Salazar','800662-ARNULGAR','albertogarcia-76@outlook.com','$2b$10$nkwnFUO46Po/lSEQAPhvreC4v.dG48OTmuzdoAIR3PtcTHxhKngL6','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-13 00:00:00.000',2,1,'2020-03-26 09:07:05.094','2020-03-26 09:07:05.094')
,(161,'herredo180781163','German ','Herrera Amado','800663-GERHERRE','german.herrera.amado@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreGlzLf0Rq53GKKs/bld9ZFU.BAxhiRmu','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-13 00:00:00.000',2,1,'2020-03-26 09:26:44.512','2020-03-26 09:26:44.512')
,(162,'taniama180781164','Tania de los Angeles ','Amagua Coello','800664-TANIACOELLO','taniaamagua@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreEa.tzNguEIELoz8f.imfqC82nbyIG3e','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-14 00:00:00.000',2,1,'2020-03-26 09:38:00.048','2020-03-26 09:38:00.048')
,(163,'sugumu180781165','Susana del Carmen ','Guerra Muñoz','800665-SANMUGUE','susanadelcarmengm@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreo4riVPiQ2OwYdip3Cqf9Lag00q/QusS','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-14 00:00:00.000',2,1,'2020-03-26 09:42:24.287','2020-03-26 09:42:24.287')
,(164,'josealca180781166','Jose Alberto ','Caceres Casalegno','800667-JOSEALBE','josealberto12caceres@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreApx5hllflYSdiToFc1t/DrVVwhplGf6','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-14 00:00:00.000',2,1,'2020-03-26 09:44:32.108','2020-03-26 09:44:32.108')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(165,'ruthmac180781167','Ruth Marlene ','Mamani Cruz','800668-RUTHMC','ruthy_k_l@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreU3XJcPrs5r3OU.ZmJLS5MXWmf/8H6EK','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-14 00:00:00.000',2,1,'2020-03-26 09:46:51.961','2020-03-26 09:46:51.961')
,(166,'lorenasm180771168','Lorena del Rocio ','Sanchez Medina','800668-SANCHEZM','san.lore@yahoo.com','$2b$10$nkwnFUO46Po/lSEQAPhvreBtLedNIRKFNZfnfXZaS0LqYx3o67yHe','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-15 00:00:00.000',2,1,'2020-03-26 09:49:19.485','2020-03-26 09:49:19.485')
,(167,'paultroya180771169','Paul Dennys ','Troya Nicolalde','800669-TROYANIC','pauldtn7769@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreuLQQyQV.7.lprMFd.ivN5xM5siMaiwy','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-18 00:00:00.000',2,1,'2020-03-26 09:50:59.626','2020-03-26 09:50:59.626')
,(168,'galoballa180771170','Galo Rene Armando ','Balladares Troya','800670-BALLADTG','gballadarest@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreg3ujEMXLR5ypJqtlC7ytmDoR7dX248C','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-20 00:00:00.000',2,1,'2020-03-26 09:52:42.899','2020-03-26 09:52:42.899')
,(169,'anthodiaz180771171','Anthony Joan ','Diaz Quiroz','800671-JOANDQ','ajdiaz1980@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreXudzjlC.pSspvLbN7l12Z7x88QN12EC','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-21 00:00:00.000',2,1,'2020-03-26 09:55:22.346','2020-03-26 09:55:22.346')
,(170,'monimaldo180771172','Monica Elizabeth ','Maldonado Bauz','800672-MALDOMONI','monica.elizabeth07@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvre73iwY1Zep5tROeIHtvVvutzDaAZ6aQe','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-21 00:00:00.000',2,1,'2020-03-26 09:57:49.943','2020-03-26 09:57:49.943')
,(171,'lenardsoliz180771173','Lenard Paul ','Soliz Flores','800673-SOLIZFLO','adrians_ptc@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreaQ6.pYB0iyYaYyiL7o9XQDWnPFIJcRi','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-22 00:00:00.000',2,1,'2020-03-26 10:00:30.918','2020-03-26 10:00:30.918')
,(172,'carmenmof180771174','Carmen del Pilar ','Moreno Freire','800674-MOREF','carmimoreno@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvre5Hq.yVmFGOU9TEAH8PuRO5AB8aHiENi','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-22 00:00:00.000',2,1,'2020-03-26 10:02:39.277','2020-03-26 10:02:39.277')
,(173,'prietolau180771175','Laura María ','Prieto Romero','800675-LAUPRIETO','lauracamilar389@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrenVB7jld677ZBDSR6l03Ssru9DRAK.ma','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-25 00:00:00.000',2,1,'2020-03-26 10:06:52.582','2020-03-26 10:06:52.582')
,(174,'geratrujillo180771176','Gerardo Ernesto ','Trujillo Romero','800676-GERARDOT','neosebastian@outlook.com','$2b$10$nkwnFUO46Po/lSEQAPhvred3HQM1LeNUqY3LWYUsotHuny7iP.QPe','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-25 00:00:00.000',2,1,'2020-03-26 10:10:05.873','2020-03-26 10:10:05.873')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(175,'victormiral180771177','Victor Anival ','Miralda Rubi','800677-ANIVICTOR','annibalmiranda17@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreYjoEEhpkXybk2jzT4Fhx9cIqEZKVBUm','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-25 00:00:00.000',2,1,'2020-03-26 10:12:41.645','2020-03-26 10:12:41.645')
,(176,'arecopablo180771178','Pablo Joaquin ','Areco','800678-PABLOJA','pabloareco1119@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvret3QD5LllIcnZy0PR6Zk1PiwpQX0u1n6','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-11-27 00:00:00.000',2,1,'2020-03-26 10:16:21.968','2020-03-26 10:16:21.968')
,(177,'tamayop180781180','Pablo Lenin ','Tamayo Moreno','800680-PABTAM','ptamayo@alphaside.com','$2b$10$nkwnFUO46Po/lSEQAPhvre9nyhxQo1UpLsh25zzszBaHyp9xDo8cy','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-04 00:00:00.000',2,1,'2020-03-26 10:21:39.039','2020-03-26 10:21:39.039')
,(178,'mejiagonz180781181','Antonio Ramon ','Mejia Gonzalez','800681-ARMEJIA','mej.antonio.7899@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvre.tSMPzQiII1SVztJEPnb9YsMreoJkwm','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-04 00:00:00.000',2,1,'2020-03-26 10:23:53.586','2020-03-26 10:23:53.586')
,(179,'valenciaca180781182','Carlos Joaquin ','Valencia Acosta','800682-VALENACO','carloscarjova@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreeywbHguo1IjcNzWxM93yqIQ02zDU7Ra','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-04 00:00:00.000',2,1,'2020-03-26 10:26:58.022','2020-03-26 10:26:58.022')
,(180,'elmersilvh180781183','Elmer Gabriel ','Silvestre Hernandez','800683-ELMGABI','egsh222@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreHcfzxQAHdFd75uztEGRHWQToYIypgG6','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-05 00:00:00.000',2,1,'2020-03-26 10:32:16.521','2020-03-26 10:32:16.521')
,(181,'guevarapa180781184','Pablo Bayardo ','Guevara Granja','800684-PABLOGU','pablo7guevara@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreB9Pf4ijoUkoYjtKTNtWBGKjfUFmtPC2','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-05 00:00:00.000',2,1,'2020-03-26 10:34:37.547','2020-03-26 10:35:12.584')
,(182,'trujillon180781186','Nery Evelina ','Trujillo Romero','800686-NERYTROMERO','puchybaby@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvre3HBqA1GNo5ZrTT8SxiFBP4CAcY.2l8y','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-09 00:00:00.000',2,1,'2020-03-26 10:38:22.798','2020-03-26 10:38:22.798')
,(183,'aleidammr1801187','Aleida Mercedes ','Martín Renals','800687-ALEMARTIN','aleidamare@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrepo2aWJJ8KPQoTxOnXlk02o3jO2T0ozi','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-09 00:00:00.000',2,1,'2020-03-26 10:40:25.057','2020-03-26 10:40:25.057')
,(184,'suarezmarle180781191','Marlene del Pilar ','Suarez Paez','800691-MSUAREZ','marlesuarez@yahoo.es','$2b$10$nkwnFUO46Po/lSEQAPhvrewAM5q/pBuD.uAcOEBlkglP3fSzR2fU2','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-11 00:00:00.000',2,1,'2020-03-26 10:43:59.611','2020-03-26 10:43:59.611')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(185,'catacelin180781192','Germania Catalina ','Celin Aguilar','800692-GCELINA','cattycelin@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvre94AOOldNLeL3y9pAwoAKUylhPhaPwRu','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-11 00:00:00.000',2,1,'2020-03-26 10:46:26.843','2020-03-26 10:46:26.843')
,(186,'anghelgg180781194','Anghel Julieth ','Gomez Gaitan','800694-GOMEZGA','anghelgomez95@outlook.com','$2b$10$nkwnFUO46Po/lSEQAPhvre.jg37av9jCSCh4Vzl74Z.zsJ/rBu7Ga','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-11 00:00:00.000',2,1,'2020-03-26 10:48:51.877','2020-03-26 10:48:51.877')
,(187,'giuseppelc180781195','Giuseppe ','Liberati Cahue','800695-LIBERATICG','giuseppeliberati@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreSH5pql5uY4HNVpRYWfzrnM8UBYI..iK','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-11 00:00:00.000',2,1,'2020-03-26 10:50:46.513','2020-03-26 10:50:46.513')
,(188,'pizarroma180781196','Miguel Angel ','Pizarro Romo','800696-MIGUELPR','patagoniahousechile@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrea/FjEwiBg9AIl1ad3cX4Lmzr1TagmMC','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-12 00:00:00.000',2,1,'2020-03-26 10:52:05.118','2020-03-26 10:52:05.118')
,(189,'antovera180781197','Maria Antonieta ','Vera Chavarria','800697-AVERACH','mverachavarria@yahoo.es','$2b$10$nkwnFUO46Po/lSEQAPhvre1ZTurJqNGKo9jWFe3Pb9dCsChuMi1OO','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-12 00:00:00.000',2,1,'2020-03-26 10:55:02.709','2020-03-26 10:55:02.709')
,(190,'hinojosaj180781198','Jenny Marlene ','Hinojosa Nuñez','800698-JENNYHN','jennymarlene1210@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreTqs2XPAe3O3Lwd8nAbQcFPkH.NNX6C.','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-12 00:00:00.000',2,1,'2020-03-26 10:56:49.049','2020-03-26 10:56:49.049')
,(191,'cuestanieto180781202','Azucena del Rocío ','Cuesta Nieto','800702-AZUCECN','azucena_cuesta@yahoo.com.mx','$2b$10$nkwnFUO46Po/lSEQAPhvreIhS5MrnBwHiKDTk1bqw7BpfHaV3NNOa','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-12 00:00:00.000',2,1,'2020-03-26 10:58:37.551','2020-03-26 10:58:37.551')
,(192,'elicaero180781204','Elizabeth Patricia ','Caero Adrian','800704-EPCAERO','elizabethpatriciacaero@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreY0gsLvI6e.ZbFIiCupD.lnryjMYRequ','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-18 00:00:00.000',2,1,'2020-03-26 11:00:38.377','2020-03-26 11:00:38.377')
,(194,'fmercapare180781206','Fernando ','Mercado Paredes','800706-FEPAREDES','fernandomp79@hotmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreSbD89x1uJj1JwGp7tuFNf785Oy/iyKq','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-25 00:00:00.000',2,1,'2020-03-26 11:10:23.241','2020-03-26 11:10:23.241')
,(195,'palaciosoj180781207','Jeanette ','Palacios Oporto ','800707-JOPORTA','jeanettpalacios74@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvreROFUknEMYBuWs7p9McHzi7Dy2TyF/BG','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-26 00:00:00.000',2,1,'2020-03-26 11:12:04.549','2020-03-26 11:12:04.549')
;
INSERT INTO public."User" (id,username,"firstName","lastName","userID",email,"password",salt,"phoneNumber","endDate","startDate","roleId",status,"createdAt","updatedAt") VALUES
(196,'lualberch180781208','Luis Alberto ','Choque Mamani','800708-LCHOQUEM','luiscmcash@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrePFXxSKurFEGNPtIHa0me8coHd2rHNWe','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-27 00:00:00.000',2,1,'2020-03-26 11:13:29.442','2020-03-26 11:13:29.442')
,(197,'mjortusol180781209','Mariel Jimena ','Ortuño Soliz','800709-MJIMESOLIZ','arq.marielsoliz@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrePFgh2dNlhD8A7DKOC6xH9eSTKmhDdEy','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-31 00:00:00.000',2,1,'2020-03-26 11:15:07.615','2020-03-26 11:15:07.615')
,(193,'sierramc180781205','Maria Cristina ','Sierra Jacome','800705-MARIACSJ','mcsierraj@gmail.com','$2b$10$nkwnFUO46Po/lSEQAPhvrelAcSGUMq1tCnBb1kX5UVPIMh1GLke7a','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,'2019-12-20 00:00:00.000',2,0,'2020-03-26 11:07:35.321','2020-03-26 11:17:55.384')
,(231,'laurens-demo','Laurens','OB','','','$2b$10$nkwnFUO46Po/lSEQAPhvrekVcMGG.KPA62bjCB5.AMuEDi8jqIsSu','$2b$10$nkwnFUO46Po/lSEQAPhvre','',NULL,NULL,2,1,'2020-03-26 11:50:26.392','2020-03-26 11:50:26.392')
;

/*UserAccount*/

-- Drop table

-- DROP TABLE public."UserAccount";

CREATE TABLE public."UserAccount" (
	id serial NOT NULL,
	"userId" int4 NOT NULL,
	"accountId" int4 NOT NULL,
	"accountValue" numeric(10,2) NULL,
	"guaranteeOperation" numeric(10,2) NULL,
	"guaranteeCredits" numeric(10,2) NULL,
	"balanceInitial" numeric(10,2) NULL,
	"balanceFinal" numeric(10,2) NULL,
	"maintenanceMargin" numeric(10,2) NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NULL,
	CONSTRAINT "UserAccount_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."UserAccount" ADD CONSTRAINT "UserAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"(id);
ALTER TABLE public."UserAccount" ADD CONSTRAINT "UserAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id);

INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(1,3,3,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-15 23:37:28.273','2020-03-15 23:37:28.275')
,(40,57,2,26769.20,26769.20,0.00,26769.20,0.00,0.00,1,'2020-03-25 11:45:49.772','2020-03-25 11:45:49.773')
,(19,28,3,344787.30,344787.30,0.00,344787.30,0.00,0.00,0,'2020-03-25 10:23:45.304','2020-03-25 11:48:09.486')
,(41,58,1,4495.67,4495.67,0.00,4495.67,0.00,0.00,1,'2020-03-25 11:49:39.515','2020-03-25 11:49:39.516')
,(42,59,1,2451.21,2451.21,0.00,2451.21,0.00,0.00,1,'2020-03-25 11:56:46.838','2020-03-25 11:56:46.838')
,(43,61,1,464.01,464.01,0.00,464.01,0.00,0.00,1,'2020-03-25 12:06:21.887','2020-03-25 12:06:21.887')
,(44,62,3,50415.84,50415.84,0.00,50415.84,0.00,0.00,1,'2020-03-25 12:15:36.927','2020-03-25 12:15:36.929')
,(45,63,2,36877.75,36877.75,0.00,36877.75,0.00,0.00,1,'2020-03-25 12:25:30.074','2020-03-25 12:25:30.074')
,(46,64,2,7817.15,7817.15,0.00,7817.15,0.00,0.00,1,'2020-03-25 12:29:45.572','2020-03-25 12:29:45.573')
,(47,65,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 12:45:35.381','2020-03-25 12:45:35.382')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(48,66,1,2532.80,2532.80,0.00,2532.80,0.00,0.00,1,'2020-03-25 12:46:26.345','2020-03-25 12:46:26.357')
,(49,68,2,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 14:04:52.898','2020-03-25 14:04:52.899')
,(50,69,3,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 14:06:09.331','2020-03-25 14:06:09.331')
,(51,70,2,21528.15,21528.15,0.00,21528.15,0.00,0.00,1,'2020-03-25 14:07:36.591','2020-03-25 14:07:36.592')
,(52,71,1,1755.28,217.16,0.00,879.18,1184.00,0.00,1,'2020-03-25 14:18:46.557','2020-03-25 14:18:46.557')
,(53,72,1,4589.00,4589.00,0.00,4589.00,0.00,0.00,1,'2020-03-25 14:47:23.417','2020-03-25 14:47:23.418')
,(54,73,1,501.60,501.60,0.00,501.60,0.00,0.00,1,'2020-03-25 14:49:05.395','2020-03-25 14:49:05.395')
,(55,74,1,1396.55,1396.55,0.00,1396.55,0.00,0.00,1,'2020-03-25 14:50:55.319','2020-03-25 14:50:55.319')
,(56,75,1,1708.36,1708.36,0.00,1708.36,0.00,0.00,1,'2020-03-25 15:04:47.440','2020-03-25 15:04:47.440')
,(57,77,1,2831.80,2831.80,0.00,2831.80,0.00,0.00,1,'2020-03-25 15:12:31.517','2020-03-25 15:12:31.518')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(58,78,1,1590.36,1590.36,0.00,1590.36,0.00,0.00,1,'2020-03-25 15:16:36.609','2020-03-25 15:16:36.609')
,(59,79,1,4104.51,4104.51,0.00,4104.51,0.00,0.00,1,'2020-03-25 15:19:40.762','2020-03-25 15:19:40.762')
,(60,80,2,15835.68,15835.68,0.00,15835.68,0.00,0.00,1,'2020-03-25 15:21:50.100','2020-03-25 15:21:50.100')
,(61,81,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 15:27:33.469','2020-03-25 15:27:33.470')
,(62,82,1,3811.62,3811.62,0.00,3811.62,0.00,0.00,1,'2020-03-25 15:29:06.447','2020-03-25 15:29:06.447')
,(63,84,1,376.20,376.20,0.00,376.20,0.00,0.00,1,'2020-03-25 15:43:44.021','2020-03-25 15:43:44.021')
,(64,85,1,1152.30,1152.30,0.00,1152.30,0.00,0.00,1,'2020-03-25 15:44:50.557','2020-03-25 15:44:50.557')
,(65,86,2,9859.34,9859.34,0.00,9859.34,0.00,0.00,1,'2020-03-25 15:48:15.989','2020-03-25 15:48:15.989')
,(66,88,1,2802.98,2802.98,0.00,2802.98,0.00,0.00,1,'2020-03-25 15:56:32.313','2020-03-25 15:56:32.313')
,(67,89,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 15:57:54.372','2020-03-25 15:57:54.373')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(68,90,1,2967.43,2967.43,0.00,2967.43,0.00,0.00,1,'2020-03-25 16:01:12.989','2020-03-25 16:01:12.989')
,(3,9,5,20600.00,0.00,0.00,20000.00,27200.00,0.00,0,'2020-03-17 18:03:49.557','2020-03-17 19:58:38.274')
,(69,91,2,29795.05,29795.05,0.00,29795.05,0.00,0.00,1,'2020-03-25 16:05:17.863','2020-03-25 16:05:17.863')
,(78,100,1,2492.44,2492.44,0.00,2492.44,0.00,0.00,1,'2020-03-25 16:30:58.160','2020-03-25 16:30:58.160')
,(70,92,2,13542.82,13542.82,0.00,13542.82,0.00,0.00,1,'2020-03-25 16:06:52.446','2020-03-25 16:06:52.446')
,(4,9,4,21000.00,0.00,0.00,20000.00,32000.00,0.00,1,'2020-03-17 20:14:02.508','2020-03-17 20:19:33.694')
,(5,11,2,4737.55,4737.55,0.00,3000.00,0.00,0.00,1,'2020-03-21 11:25:13.967','2020-03-21 11:25:13.967')
,(71,93,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 16:10:55.462','2020-03-25 16:10:55.463')
,(72,95,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 16:13:35.355','2020-03-25 16:13:35.355')
,(73,96,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 16:15:25.892','2020-03-25 16:15:25.892')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(6,12,2,5000.00,603.40,5000.00,5000.00,0.00,0.00,1,'2020-03-21 11:53:01.014','2020-03-21 13:51:40.546')
,(7,13,2,26041.43,2386.43,0.00,26041.43,0.00,0.00,1,'2020-03-24 11:28:11.319','2020-03-24 11:28:11.327')
,(8,13,5,50000.00,0.00,0.00,50000.00,0.00,0.00,1,'2020-03-24 12:48:19.588','2020-03-24 12:48:19.588')
,(9,14,1,3680.91,668.22,0.00,3680.91,0.00,0.00,1,'2020-03-24 17:50:25.222','2020-03-24 17:50:25.224')
,(10,16,5,41415.57,0.00,0.00,41415.57,0.00,0.00,1,'2020-03-24 18:33:34.492','2020-03-24 18:33:34.493')
,(11,17,1,3337.96,3337.96,0.00,3337.96,0.00,0.00,1,'2020-03-25 10:02:45.489','2020-03-25 10:02:45.491')
,(12,20,1,688.79,688.79,0.00,688.79,0.00,0.00,1,'2020-03-25 10:08:25.584','2020-03-25 10:08:25.584')
,(13,21,1,2671.79,2671.79,0.00,2671.79,0.00,0.00,1,'2020-03-25 10:12:13.974','2020-03-25 10:12:13.975')
,(2,9,2,18900.00,18900.00,0.00,20000.00,0.00,0.00,0,'2020-03-16 16:29:56.498','2020-03-25 16:16:57.999')
,(14,22,2,12631.52,12631.52,0.00,12631.52,0.00,0.00,1,'2020-03-25 10:14:47.867','2020-03-25 10:14:47.868')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(15,23,1,1863.52,1863.52,0.00,1863.52,0.00,0.00,1,'2020-03-25 10:17:14.038','2020-03-25 10:17:14.038')
,(16,24,2,12346.00,12346.00,0.00,12346.00,0.00,0.00,1,'2020-03-25 10:18:47.730','2020-03-25 10:18:47.730')
,(17,25,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 10:20:16.605','2020-03-25 10:20:16.605')
,(18,27,2,8475.50,8475.50,0.00,8475.50,0.00,0.00,1,'2020-03-25 10:22:04.412','2020-03-25 10:22:04.412')
,(20,29,2,6100.46,6100.46,0.00,6100.46,0.00,0.00,1,'2020-03-25 10:24:38.902','2020-03-25 10:24:38.902')
,(21,30,2,12809.76,12809.76,0.00,12809.76,0.00,0.00,1,'2020-03-25 10:28:24.085','2020-03-25 10:28:24.085')
,(22,31,1,3350.65,3350.65,0.00,3350.65,0.00,0.00,1,'2020-03-25 10:31:13.616','2020-03-25 10:31:13.617')
,(23,32,2,13249.72,13249.72,0.00,13249.72,0.00,0.00,1,'2020-03-25 10:33:23.841','2020-03-25 10:33:23.841')
,(24,33,1,3178.36,3178.36,0.00,3178.36,0.00,0.00,1,'2020-03-25 10:34:23.988','2020-03-25 10:34:23.988')
,(26,35,2,12718.61,12718.61,0.00,12718.61,0.00,0.00,1,'2020-03-25 10:36:17.519','2020-03-25 10:36:17.520')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(27,36,1,4373.73,4373.73,0.00,4373.73,0.00,0.00,0,'2020-03-25 10:38:30.661','2020-03-25 11:06:28.575')
,(25,34,2,36464.29,36464.29,0.00,36464.29,0.00,0.00,0,'2020-03-25 10:35:19.976','2020-03-25 11:06:50.938')
,(28,37,2,38740.00,38740.00,0.00,38740.00,0.00,0.00,1,'2020-03-25 11:09:48.313','2020-03-25 11:09:48.313')
,(29,38,2,8328.77,8328.77,0.00,8328.77,0.00,0.00,1,'2020-03-25 11:11:02.309','2020-03-25 11:11:02.309')
,(30,42,2,11008.46,11008.46,0.00,11008.46,0.00,0.00,1,'2020-03-25 11:14:14.473','2020-03-25 11:14:14.473')
,(31,43,2,15519.95,15519.95,0.00,15519.95,0.00,0.00,1,'2020-03-25 11:17:31.594','2020-03-25 11:17:31.595')
,(32,44,2,15000.00,15000.00,0.00,15000.00,0.00,0.00,1,'2020-03-25 11:18:46.191','2020-03-25 11:18:46.191')
,(33,46,2,15007.95,15007.95,0.00,15007.95,0.00,0.00,1,'2020-03-25 11:20:29.866','2020-03-25 11:20:29.866')
,(34,47,2,12744.43,12744.43,0.00,12744.43,0.00,0.00,1,'2020-03-25 11:21:21.029','2020-03-25 11:21:21.029')
,(35,49,2,6577.18,6577.18,0.00,6577.18,0.00,0.00,1,'2020-03-25 11:23:13.634','2020-03-25 11:23:13.634')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(36,50,2,18636.14,18636.14,0.00,18636.14,0.00,0.00,1,'2020-03-25 11:24:00.518','2020-03-25 11:24:00.518')
,(37,52,1,254.93,254.93,0.00,254.93,0.00,0.00,1,'2020-03-25 11:25:30.679','2020-03-25 11:25:30.680')
,(38,54,2,10991.82,10991.82,0.00,10991.82,0.00,0.00,1,'2020-03-25 11:28:44.985','2020-03-25 11:28:44.986')
,(39,56,2,15837.46,15837.46,0.00,15837.46,0.00,0.00,1,'2020-03-25 11:40:54.028','2020-03-25 11:40:54.029')
,(74,97,2,46949.54,46949.54,0.00,46949.54,0.00,0.00,1,'2020-03-25 16:22:18.616','2020-03-25 16:22:18.616')
,(75,20,5,6541.69,0.00,0.00,6541.69,0.00,0.00,1,'2020-03-25 16:22:32.382','2020-03-25 16:22:32.382')
,(76,98,2,8038.11,8038.11,0.00,8038.11,0.00,0.00,1,'2020-03-25 16:28:45.271','2020-03-25 16:28:45.272')
,(77,99,1,22.97,22.97,0.00,22.97,0.00,0.00,1,'2020-03-25 16:29:49.696','2020-03-25 16:29:49.696')
,(79,101,1,2604.43,2604.43,0.00,2604.43,0.00,0.00,1,'2020-03-25 16:35:16.668','2020-03-25 16:35:16.669')
,(80,102,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 16:36:15.457','2020-03-25 16:36:15.457')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(81,103,2,8004.14,8004.14,0.00,8004.14,0.00,0.00,1,'2020-03-25 16:41:25.479','2020-03-25 16:41:25.480')
,(82,105,1,2746.26,2746.26,0.00,2746.26,0.00,0.00,1,'2020-03-25 16:45:06.021','2020-03-25 16:45:06.021')
,(83,106,2,17243.65,17243.65,0.00,17243.65,0.00,0.00,1,'2020-03-25 16:50:11.023','2020-03-25 16:50:11.024')
,(84,107,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 17:00:32.424','2020-03-25 17:00:32.424')
,(85,108,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 17:01:29.229','2020-03-25 17:01:29.229')
,(86,110,1,1000.00,1000.00,0.00,1000.00,0.00,0.00,1,'2020-03-25 17:03:19.201','2020-03-25 17:03:19.201')
,(87,28,3,344787.30,31407.30,0.00,344787.30,0.00,0.00,1,'2020-03-25 17:07:30.901','2020-03-25 17:07:30.902')
,(88,114,1,3926.02,3926.02,0.00,3926.02,0.00,0.00,1,'2020-03-25 17:13:08.518','2020-03-25 17:13:08.519')
,(89,115,2,5598.05,5598.05,0.00,5598.05,0.00,0.00,1,'2020-03-25 17:14:19.370','2020-03-25 17:14:19.370')
,(90,116,2,9509.56,9509.56,0.00,9509.56,0.00,0.00,1,'2020-03-25 17:17:05.820','2020-03-25 17:17:05.821')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(91,118,2,5759.43,5759.43,0.00,5759.43,0.00,0.00,1,'2020-03-25 17:21:17.682','2020-03-25 17:21:17.683')
,(92,120,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 17:27:30.725','2020-03-25 17:27:30.726')
,(93,121,1,4274.99,4274.99,0.00,4274.99,0.00,0.00,1,'2020-03-25 17:31:32.963','2020-03-25 17:31:32.963')
,(94,122,1,3088.00,408.00,950.00,1890.00,1280.96,0.00,1,'2020-03-25 17:38:26.289','2020-03-25 17:38:26.289')
,(95,123,2,46396.52,35896.52,0.00,5500.00,4537.50,0.00,1,'2020-03-25 17:42:10.948','2020-03-25 17:42:10.949')
,(96,41,2,35561.07,33165.57,0.00,35561.07,0.00,0.00,1,'2020-03-25 17:43:31.371','2020-03-25 17:43:31.371')
,(98,41,5,6312.48,0.00,0.00,6312.48,0.00,0.00,1,'2020-03-25 17:44:38.610','2020-03-25 17:44:38.610')
,(99,125,2,11392.82,11392.82,0.00,11392.82,0.00,0.00,1,'2020-03-25 17:45:04.851','2020-03-25 17:45:04.852')
,(97,124,2,11142.86,11142.86,0.00,11142.86,0.00,0.00,1,'2020-03-25 17:43:36.499','2020-03-25 17:45:28.601')
,(100,126,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 17:47:46.218','2020-03-25 17:47:46.219')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(101,127,2,6073.81,1408.81,0.00,3110.00,4587.32,0.00,1,'2020-03-25 17:52:14.582','2020-03-25 17:52:14.582')
,(102,128,2,10614.34,10614.34,0.00,10614.34,0.00,0.00,1,'2020-03-25 17:53:24.881','2020-03-25 17:53:24.882')
,(103,129,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 17:58:36.209','2020-03-25 17:58:36.212')
,(104,130,2,13150.33,4540.33,0.00,4510.00,8373.40,0.00,1,'2020-03-25 18:00:31.896','2020-03-25 18:00:31.896')
,(105,131,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 18:02:17.970','2020-03-25 18:02:17.971')
,(106,132,1,1067.40,1067.40,0.00,1067.40,0.00,0.00,1,'2020-03-25 18:13:35.041','2020-03-25 18:13:35.041')
,(107,133,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-25 18:14:14.016','2020-03-25 18:14:14.016')
,(108,134,2,10.07,10.07,0.00,10.07,0.00,0.00,1,'2020-03-26 08:05:09.748','2020-03-26 08:05:49.597')
,(109,135,3,139179.39,139179.39,0.00,139179.39,0.00,0.00,1,'2020-03-26 08:10:30.510','2020-03-26 08:10:30.510')
,(110,136,2,6468.58,6468.58,0.00,6468.58,0.00,0.00,1,'2020-03-26 08:11:59.704','2020-03-26 08:11:59.704')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(111,137,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 08:16:11.228','2020-03-26 08:16:11.229')
,(112,138,2,21487.78,17007.19,0.00,2990.44,16180.99,0.00,1,'2020-03-26 08:18:02.195','2020-03-26 08:18:02.196')
,(113,139,2,15604.06,6994.06,0.00,4510.00,2227.50,0.00,1,'2020-03-26 08:19:36.403','2020-03-26 08:19:36.403')
,(114,140,2,10458.78,10458.78,0.00,10458.78,0.00,0.00,1,'2020-03-26 08:20:45.133','2020-03-26 08:20:45.134')
,(115,141,2,10196.86,10196.86,0.00,10196.86,0.00,0.00,1,'2020-03-26 08:28:00.696','2020-03-26 08:28:00.696')
,(116,142,1,3671.42,3671.42,0.00,3671.42,0.00,0.00,1,'2020-03-26 08:28:55.669','2020-03-26 08:29:18.602')
,(117,143,2,7735.29,7735.29,0.00,7735.29,0.00,0.00,1,'2020-03-26 08:30:14.740','2020-03-26 08:30:14.741')
,(118,144,3,163355.14,135467.17,0.00,26018.73,21574.75,0.00,1,'2020-03-26 08:33:12.976','2020-03-26 08:33:12.977')
,(119,145,2,26532.36,26532.36,0.00,26532.36,0.00,0.00,1,'2020-03-26 08:34:16.262','2020-03-26 08:34:16.262')
,(120,147,3,54419.10,54419.10,0.00,54419.10,0.00,0.00,1,'2020-03-26 08:38:28.855','2020-03-26 08:38:28.856')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(121,148,1,2452.21,2452.21,0.00,2452.21,0.00,0.00,1,'2020-03-26 08:39:46.190','2020-03-26 08:39:46.190')
,(122,149,2,24335.72,24335.72,0.00,24335.72,0.00,0.00,1,'2020-03-26 08:41:18.089','2020-03-26 08:41:18.091')
,(123,150,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 08:42:52.368','2020-03-26 08:42:52.368')
,(124,151,2,7471.75,7471.75,0.00,7471.75,0.00,0.00,1,'2020-03-26 08:44:15.222','2020-03-26 08:44:15.225')
,(125,152,3,63687.80,63687.80,0.00,63687.80,0.00,0.00,1,'2020-03-26 08:46:25.721','2020-03-26 08:46:25.721')
,(126,155,2,22910.24,4360.24,0.00,9730.00,7733.75,0.00,1,'2020-03-26 08:55:00.565','2020-03-26 08:55:00.565')
,(127,156,2,33141.00,33141.00,0.00,33141.00,0.00,0.00,1,'2020-03-26 08:59:46.297','2020-03-26 08:59:46.298')
,(128,157,2,4053.07,4053.07,0.00,4053.07,0.00,0.00,1,'2020-03-26 09:03:07.643','2020-03-26 09:03:07.644')
,(129,158,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 09:04:13.594','2020-03-26 09:04:13.598')
,(130,159,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 09:06:27.120','2020-03-26 09:06:27.121')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(131,160,2,4589.00,4589.00,0.00,4589.00,0.00,0.00,1,'2020-03-26 09:09:09.716','2020-03-26 09:09:09.716')
,(132,34,2,36464.29,3776.29,0.00,36464.29,0.00,0.00,1,'2020-03-26 09:19:42.860','2020-03-26 09:19:42.862')
,(133,161,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 09:28:57.983','2020-03-26 09:28:57.984')
,(134,162,1,2115.39,2115.39,0.00,2115.39,0.00,0.00,1,'2020-03-26 09:39:39.937','2020-03-26 09:39:39.938')
,(135,163,2,5311.33,5311.33,0.00,5311.33,0.00,0.00,1,'2020-03-26 09:46:19.478','2020-03-26 09:46:19.479')
,(136,34,2,36464.29,3776.29,0.00,36464.29,0.00,0.00,1,'2020-03-26 09:46:42.852','2020-03-26 09:46:42.852')
,(137,164,1,2490.20,2490.20,0.00,2490.20,0.00,0.00,1,'2020-03-26 09:47:16.620','2020-03-26 09:47:16.620')
,(138,36,1,4373.73,500.26,0.00,4373.73,0.00,0.00,1,'2020-03-26 09:48:05.660','2020-03-26 09:48:05.660')
,(139,165,1,1549.93,285.75,0.00,1264.18,794.02,0.00,1,'2020-03-26 09:48:35.669','2020-03-26 09:48:35.669')
,(140,166,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 09:57:35.899','2020-03-26 09:57:35.899')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(141,167,1,4513.27,4513.27,0.00,4513.27,0.00,0.00,1,'2020-03-26 09:59:50.468','2020-03-26 09:59:50.468')
,(142,168,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:00:37.808','2020-03-26 10:00:37.810')
,(143,169,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:01:33.342','2020-03-26 10:01:33.342')
,(144,170,2,16431.58,16431.58,0.00,16431.58,0.00,0.00,1,'2020-03-26 10:02:56.183','2020-03-26 10:02:56.185')
,(145,171,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:03:38.610','2020-03-26 10:03:38.611')
,(146,172,1,3539.36,3539.36,0.00,3539.36,0.00,0.00,1,'2020-03-26 10:04:55.062','2020-03-26 10:04:55.062')
,(147,173,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:07:57.349','2020-03-26 10:07:57.350')
,(148,174,2,11341.23,11341.23,0.00,11341.23,0.00,0.00,1,'2020-03-26 10:11:21.877','2020-03-26 10:11:21.878')
,(149,175,2,8102.67,1062.68,0.00,4726.26,4936.93,0.00,1,'2020-03-26 10:14:36.770','2020-03-26 10:14:36.771')
,(150,176,1,3552.99,3552.99,0.00,3552.99,0.00,0.00,1,'2020-03-26 10:18:17.322','2020-03-26 10:18:17.322')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(151,177,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:22:56.902','2020-03-26 10:22:56.902')
,(152,178,1,2972.23,2972.23,0.00,2972.23,0.00,0.00,1,'2020-03-26 10:36:14.370','2020-03-26 10:36:14.371')
,(153,179,2,5249.32,5249.32,0.00,5249.32,0.00,0.00,1,'2020-03-26 10:37:09.080','2020-03-26 10:37:09.080')
,(154,180,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:38:31.194','2020-03-26 10:38:31.194')
,(155,181,2,16082.95,16082.95,0.00,16082.95,0.00,0.00,1,'2020-03-26 10:39:30.970','2020-03-26 10:39:30.970')
,(156,182,2,15877.82,15877.82,0.00,15877.82,0.00,0.00,1,'2020-03-26 10:41:00.215','2020-03-26 10:41:00.216')
,(157,183,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:43:33.195','2020-03-26 10:43:33.195')
,(158,184,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:45:13.853','2020-03-26 10:45:13.853')
,(159,185,1,3932.70,3932.70,0.00,3932.70,0.00,0.00,1,'2020-03-26 10:47:37.458','2020-03-26 10:47:37.458')
,(160,186,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:50:16.645','2020-03-26 10:50:16.646')
;
INSERT INTO public."UserAccount" (id,"userId","accountId","accountValue","guaranteeOperation","guaranteeCredits","balanceInitial","balanceFinal","maintenanceMargin",status,"createdAt","updatedAt") VALUES
(161,187,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:51:29.169','2020-03-26 10:51:29.170')
,(162,187,1,0.00,0.00,0.00,0.00,0.00,0.00,1,'2020-03-26 10:53:15.599','2020-03-26 10:53:15.599')
,(163,189,2,4651.68,4651.68,0.00,4651.68,0.00,0.00,1,'2020-03-26 10:56:03.146','2020-03-26 10:56:03.147')
,(164,190,1,1357.46,1357.46,0.00,1357.46,0.00,0.00,1,'2020-03-26 10:58:11.172','2020-03-26 10:58:11.173')
,(165,191,2,15688.04,15688.04,0.00,15688.04,0.00,0.00,1,'2020-03-26 11:00:16.411','2020-03-26 11:00:16.412')
,(166,192,2,6085.37,6085.37,0.00,6085.37,0.00,0.00,1,'2020-03-26 11:01:21.141','2020-03-26 11:01:21.142')
,(167,194,2,6312.57,6312.57,0.00,6312.57,0.00,0.00,1,'2020-03-26 11:13:19.809','2020-03-26 11:13:19.810')
,(168,195,1,2368.21,2368.21,0.00,2368.21,0.00,0.00,1,'2020-03-26 11:16:34.873','2020-03-26 11:16:34.874')
,(169,196,1,1260.02,1260.02,0.00,1260.02,0.00,0.00,1,'2020-03-26 11:18:10.292','2020-03-26 11:18:10.292')
,(170,197,1,2183.33,2183.33,0.00,2183.33,0.00,0.00,1,'2020-03-26 11:19:28.316','2020-03-26 11:19:28.316')
;

/*FUNCTIONS*/

CREATE OR REPLACE FUNCTION public."investmentMovement_after_insert"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
consolidado numeric(10,2);
    begin
	    consolidado := (Select "amount"
						From "InvestmentOperation"
                        Where id = new."investmentOperationId");

	UPDATE "InvestmentOperation"
    SET "amount" = consolidado + NEW."gpAmount"
   	Where id = new."investmentOperationId";

        RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."investmentMovement_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
consolidado numeric(10,2);
currentBehavior integer;
newAmount numeric(10,2);

    begin
	    consolidado := (Select "amount"
						From "InvestmentOperation"
                        Where id = old."investmentOperationId");

	newAmount := consolidado - old."gpAmount" + new."gpAmount";



	UPDATE "InvestmentOperation"
    SET "amount" = newAmount
 	Where id = old."investmentOperationId";


    RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."investmentOperation_after_insert"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
garatias numeric(10,2);
    begin
	    garatias := (Select "guaranteeOperation"
						From "UserAccount"
                        Where id = new."userAccountId");

        RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."investmentOperation_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
garatias numeric(10,2);
totalOperationAmount numeric(10,2);

    begin
	    garatias := (Select "guaranteeOperation"
						From "UserAccount"
                        Where id = new."userAccountId");

        totalOperationAmount := (Select sum("amount")
						From "InvestmentOperation"
                        Where "userAccountId" = new."userAccountId");



        RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."marketMovement_after_detele"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
consolidado numeric(10,2);
currentBehavior integer;
newAmount numeric(10,2);

    begin
	    consolidado := (Select "amount"
						From "MarketOperation"
                        Where id = old."marketOperationId");

	newAmount := consolidado - old."gpAmount";



	UPDATE "MarketOperation"
    SET "amount" = newAmount
 	Where id = old."marketOperationId";


    RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."marketMovement_after_insert"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
consolidado numeric(10,2);
currentBehavior integer;
newAmount numeric(10,2);

    begin
	    consolidado := (Select "amount"
						From "MarketOperation"
                        Where id = new."marketOperationId");

	newAmount := consolidado + NEW."gpAmount";


	IF (newAmount = consolidado) then
		currentBehavior := 0;
    ELSIF (newAmount > consolidado) then
        currentBehavior := 1;
   	ELSIF (newAmount < consolidado) then
        currentBehavior := 2;
   END IF;

	UPDATE "MarketOperation"
    SET "amount" = newAmount,
    	"behavior" = currentBehavior
 	Where id = new."marketOperationId";


    RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."marketMovement_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
consolidado numeric(10,2);
currentBehavior integer;
newAmount numeric(10,2);

    begin
	    consolidado := (Select "amount"
						From "MarketOperation"
                        Where id = old."marketOperationId");

	newAmount := consolidado - old."gpAmount" + new."gpAmount";



	UPDATE "MarketOperation"
    SET "amount" = newAmount
 	Where id = old."marketOperationId";


    RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."marketOperation_after_insert"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
garatias numeric(10,2);
    begin
	    garatias := (Select "guaranteeOperation"
						From "UserAccount"
                        Where id = new."userAccountId");
/*
	UPDATE "UserAccount"
    SET "guaranteeOperation" = (garatias - NEW."initialAmount" - new."maintenanceMargin")
   	WHERE id = new."userAccountId";

	   */
        RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."marketOperation_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
garatias numeric(10,2);
currentAccountAmount numeric(10,2);
totalOperationAmount numeric(10,2);
operationAmount numeric(10,2);


    begin
	    garatias := (Select "guaranteeOperation"
						From "UserAccount"
                        Where id = new."userAccountId");

   		currentAccountAmount := (Select "accountValue"
						From "UserAccount"
                        Where id = new."userAccountId");


                       totalOperationAmount := (Select sum("gpAmount")
						From "MarketMovement"
                        Where "marketOperationId" = new."id");

	/*
                       UPDATE "UserAccount"
    SET "accountValue" = (currentAccountAmount + totalOperationAmount)
   	WHERE id = new."userAccountId";
  */

        RETURN NEW;
    END;
$function$
;

/*=======*/

CREATE OR REPLACE FUNCTION public."userAccount_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
currentAmount numeric(10,2);
newAmount numeric(10,2);
currentGuarantee numeric(10,2);
newGuarantee numeric(10,2);
diffNewOldAmount numeric(10,2);


    begin

	 currentAmount := old."accountValue";
	 newAmount := new."accountValue";
	 currentGuarantee := old."guaranteeOperation";
	 newGuarantee := new."guaranteeOperation";

     diffNewOldAmount := newAmount - currentAmount;

/*
    IF (currentAmount != newAmount) then
	 UPDATE "UserAccount"
    SET "guaranteeOperation" = diffNewOldAmount + currentGuarantee where id = old.id;
 	end if;
*/
        RETURN NEW;
    END;
$function$
;

/*=======*/

/*TRIGGER*/

-- DROP TRIGGER investmentmovement_after_insert ON public."InvestmentMovement";

create trigger investmentmovement_after_insert after
insert
    on
    public."InvestmentMovement" for each row execute procedure "investmentMovement_after_insert"();

/*=======*/

   -- DROP TRIGGER investmentmovement_after_update ON public."InvestmentMovement";

create trigger investmentmovement_after_update after
update
    on
    public."InvestmentMovement" for each row execute procedure "investmentMovement_after_update"();

/*=======*/

 -- DROP TRIGGER investmentoperation_after_insert ON public."InvestmentOperation";

create trigger investmentoperation_after_insert after
insert
    on
    public."InvestmentOperation" for each row execute procedure "investmentOperation_after_insert"();

/*=======*/
-- DROP TRIGGER investmentoperation_after_update ON public."InvestmentOperation";

create trigger investmentoperation_after_update after
update
    on
    public."InvestmentOperation" for each row execute procedure "investmentOperation_after_update"();

/*=======*/
-- DROP TRIGGER marketmovement_after_insert ON public."MarketMovement";

create trigger marketmovement_after_insert after
insert
    on
    public."MarketMovement" for each row execute procedure "marketMovement_after_insert"();


/*=======*/
-- DROP TRIGGER marketmovement_after_detele ON public."MarketMovement";

create trigger marketmovement_after_detele after
delete
    on
    public."MarketMovement" for each row execute procedure "marketMovement_after_detele"();

/*=======*/
-- DROP TRIGGER marketmovement_after_update ON public."MarketMovement";

create trigger marketmovement_after_update after
update
    on
    public."MarketMovement" for each row execute procedure "marketMovement_after_update"();


/*=======*/
-- DROP TRIGGER marketoperation_after_insert ON public."MarketOperation";

create trigger marketoperation_after_insert after
insert
    on
    public."MarketOperation" for each row execute procedure "marketOperation_after_insert"();


/*=======*/

-- DROP TRIGGER marketoperation_after_update ON public."MarketOperation";

create trigger marketoperation_after_update after
update
    on
    public."MarketOperation" for each row execute procedure "marketOperation_after_update"();

/*=======*/

-- DROP TRIGGER useraccount_after_update ON public."UserAccount";

create trigger useraccount_after_update after
update
    on
    public."UserAccount" for each row execute procedure "userAccount_after_update"();


/*=======*/

/*Add Column To Market Operations*/
ALTER TABLE public."UserAccount" ADD "marginUsed" numeric(10,2) NULL;

/*Add Column To User Account*/
ALTER TABLE public."UserAccount" ADD "commissionByReference" numeric(10,2) NULL;

ALTER TABLE public."UserAccount" ADD "commissionByReference" numeric(10,2) NULL;

/*
* Start Changes August 13, 2020
*/


/*Add Column To Market Operations*/
ALTER TABLE public."MarketOperation" ADD "holdStatusCount" int4 DEFAULT 0;
ALTER TABLE public."MarketOperation" ADD "holdStatusCommission" numeric(10,2) DEFAULT 0;

/*Setting*/

-- Drop table

-- DROP TABLE public."Commodity";

CREATE TABLE public."Setting" (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"status" int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Settings_name_key" UNIQUE (name),
	CONSTRAINT "Settings_pkey" PRIMARY KEY (id)
);

INSERT INTO public."Setting" (id,"name","value", "status","createdAt","updatedAt") VALUES
(1,'holdStatusPrice',"2",1,'2020-08-14 20:56:08.846','2020-08-14 20:56:08.846')
;

CREATE OR REPLACE FUNCTION public."marketOperation_before_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
currentHoldCount int4;
newStatus int4;
holdStatusPrice numeric(10,2);
updatedHoldCommission numeric(10,2);

begin

	holdStatusPrice := (Select "value"
						From public."Setting"
                        Where id = 1);



	IF (new.status = 3) then
	NEW."holdStatusCount" := old."holdStatusCount" + 1;
	NEW."holdStatusCommission" := holdStatusPrice * NEW."holdStatusCount";
  NEW."updatedAt" := NOW();

/*UPDATE "MarketOperation"
		SET "holdStatusCount" = currentHoldCount where id = new.id;
		*/
	end if;
   /*RAISE EXCEPTION 'Nonexistent ID --> %', new."holdStatusCount";*/
   RETURN NEW;
END;
$function$
;


-- DROP TRIGGER marketoperation_before_update ON public."MarketOperation";

create trigger marketoperation_before_update before
update
    on
    public."MarketOperation" for each row execute procedure "marketOperation_before_update"();


/*
* End Changes August 13, 2020
*/

/*===================================*/
/*
* Start Changes August 21, 2020
*/
ALTER TABLE public."MarketOperation" ADD "accountValueEndOperation" numeric(10,2) DEFAULT 0;
ALTER TABLE public."MarketOperation" ADD "guaranteeValueEndOperation" numeric(10,2) DEFAULT 0;
ALTER TABLE public."MarketOperation" ADD "commissionValueEndOperation" numeric(10,2) DEFAULT 0;
ALTER TABLE public."MarketOperation" ADD "guaranteeOperationValueEndOperation" numeric(10,2) DEFAULT 0;
ALTER TABLE public."MarketOperation" ADD "holdStatusCommissionEndOperation" numeric(10,2) DEFAULT 0;

ALTER TABLE public."MarketOperation" ADD "profitBrut" numeric(10,2) DEFAULT 0;
ALTER TABLE public."MarketOperation" ADD "profitNet" numeric(10,2) DEFAULT 0;


ALTER TABLE public."UserAccount" ADD "snapShotAccount" varchar() DEFAULT '';


/*
* End Changes August 21, 2020
*/


/*
* Star Changes August 25, 2020
*/
ALTER TABLE public."Account" ADD "holdStatusCommissionAmount" numeric(10,2) DEFAULT 0;

ALTER TABLE public."User" ADD "firstName2" varchar(255) DEFAULT '';
ALTER TABLE public."User" ADD "lastName2" varchar(255) DEFAULT '';
ALTER TABLE public."User" ADD "firstName3" varchar(255) DEFAULT '';
ALTER TABLE public."User" ADD "lastName3" varchar(255) DEFAULT '';
ALTER TABLE public."User" ADD "firstName4" varchar(255) DEFAULT '';
ALTER TABLE public."User" ADD "lastName4" varchar(255) DEFAULT '';

ALTER TABLE public."UserAccount" ADD "brokerId" int4;

CREATE OR REPLACE FUNCTION public."marketOperation_before_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
currentHoldCount int4;
newStatus int4;
holdStatusPrice numeric(10,2);
updatedHoldCommission numeric(10,2);

begin

	holdStatusPrice := (select
							"userAccount->account"."holdStatusCommissionAmount" as "userAccount.account.holdStatusCommissionAmount"
						from
							"MarketOperation" as "MarketOperation"
						left outer join "UserAccount" as "userAccount" on
							"MarketOperation"."userAccountId" = "userAccount"."id"
						left outer join "User" as "userAccount->user" on
							"userAccount"."userId" = "userAccount->user"."id"
						left outer join "Account" as "userAccount->account" on
							"userAccount"."accountId" = "userAccount->account"."id"
						where
							"MarketOperation"."id" = new.id);



	IF (new.status = 3) then
	NEW."holdStatusCount" := old."holdStatusCount" + 1;
	NEW."holdStatusCommission" := holdStatusPrice * NEW."holdStatusCount";
	NEW."updatedAt" := NOW();

/*UPDATE "MarketOperation"
		SET "holdStatusCount" = currentHoldCount where id = new.id;
		*/
	end if;
   /*RAISE EXCEPTION 'Nonexistent ID --> %', new."holdStatusCount";*/
   RETURN NEW;
END;
$function$
;


/*
* End Changes August 25, 2020
*/

/*
* Star Changes September 1, 2020
*/
-- Drop table

-- DROP TABLE public."Referral";

CREATE TABLE public."Referral" (
	id serial NOT NULL,
	"firstName" varchar(255) NULL,
	"lastName" varchar(255) NULL,
	email varchar(255) NULL,
	"phoneNumber" varchar(255) NULL,
	country varchar(255) NULL,
	city varchar(255) NULL,
	"jobTitle" varchar(255) NULL,
	"initialAmount" numeric(10,2) NULL,
	"hasBrokerGuarantee" int4 NULL,
	"brokerGuaranteeCode" varchar(255) NULL,
	quantity int4 NULL,
	"personalIdDocument" bytea NULL,
	"collaboratorIB" varchar(255) NULL,
	description varchar(500) NULL,
	notes varchar(500) NULL,
	"userAccountId" int4 NULL,
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Referral_pkey" PRIMARY KEY (id)
);

/*
* End Changes September 1, 2020
*/


/*
* Start Changes September 27, 2020
*/
/*MarketMovement*/


-- Drop table

-- DROP TABLE public."MarketMovement";

CREATE TABLE public."UserAccountMovement" (
	id serial NOT NULL,
	"userAccountId" int4 NOT NULL,
	"debit" numeric(10,2) NULL,
	"credit" numeric(10,2) NULL,
	"accountValue" numeric(10,2) NULL,
	"reference" varchar(255) NULL,
	"snapShotAccount" varchar DEFAULT '',
	status int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "UserAccountMovement_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."UserAccountMovement" ADD CONSTRAINT "UserAccountMovement_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"(id);


/*
* End Changes September 27, 2020
*/

/*
* Start Changes Oct 5, 2020
*/
ALTER TABLE public."UserAccountMovement" ADD "previousAccountValue" numeric(10,2) DEFAULT 0;

/*
* End Changes Oct 5, 2020
*/

ALTER TABLE public."Referral" ADD "username" varchar(255) DEFAULT '';

/*
* Start Changes Oct 26, 2020
*/
CREATE TABLE public."Log" (
	id serial NOT NULL,
	"userId" int4 NOT NULL,
	"tableUpdated" varchar(255) NULL,
	"action" varchar(255) NULL,
	"type" varchar(255) NULL,
	"userAccountId" int4 NOT NULL,
	"snapShotBeforeAction" varchar NULL,
	"snapShotAfterAction" varchar NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "logs_pkey" PRIMARY KEY (id)
);

/*
* End Changes Oct 26, 2020
*/

/*
* Start Changes Mar 01, 2021
*/
ALTER TABLE public."MarketOperation" ADD "accountValueBeforeEndOperation" numeric(10,2) NULL;

/*
* End Changes Mar 01, 2021
*/