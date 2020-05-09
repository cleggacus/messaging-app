#!/bin/bash
for i in {1..10}
do
curl -d '{"username":"cleggacus'$i'", "password":"Test1234"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/user/register
curl -d '{"username":"liam'$i'", "password":"Test1234"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/user/register
curl -d '{"username":"liamclegg'$i'", "password":"Test1234"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/user/register
curl -d '{"username":"clegg'$i'", "password":"Test1234"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/user/register
done