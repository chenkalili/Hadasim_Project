chen kalili. id=325060911

I ran the client side through Postman

I saved the data in 3 tables, in order to get a logical division

----------------------------------------------------

personal_details table contains the following data:
* firstName * lastName * id * city * street * homeNumber * dateOfBirth * telephone * mobile

add data:
POST: http://localhost:3000/api/addPerson/? - (add the whole data)

![img_4.png](img_4.png)

get data:
GET: http://localhost:3000/api/getPerson/?

![img_3.png](img_3.png)

----------------------------------------------------

corona_results_dates table contains the following data:
* id * positiveResultDate * recoveryDate

add data:
POST: http://localhost:3000/api/addCoronaResults/? - (add the whole data)

![img_5.png](img_5.png)

get data:
GET: http://localhost:3000/api/getCoronaResults/?

![img_1.png](img_1.png)

----------------------------------------------------

vaccination_details table contains the following data:
* id * vaccinDate * manufacturer

add data:
POST: http://localhost:3000/api/addVaccin/? - (add the whole data)

![img_6.png](img_6.png)

get data:
GET: http://localhost:3000/api/getVaccin/?

![img_2.png](img_2.png)

----------------------------------------------------

To get the whole data:
GET: http://localhost:3000/api/getData/?
![img.png](img.png)

----------------------------------------------------

Bonus:
* GET: http://localhost:3000/api/getPatientsByDay/?
* GET: http://localhost:3000/api/getUnvaccinated/?
