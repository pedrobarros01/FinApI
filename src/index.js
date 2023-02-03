/* 
    cpf -> string
    name -> string
    id -> uuid
    statement -> [] 
*/
const express = require('express');
const {v4: uuidv4} = require("uuid");
const app = express();

app.use(express.json());

const customers = [];

//MiddleWare
function verifyIfExistsAccountCpf(request, response, next){
    const {cpf} = request.headers;
    const customer = customers.find(customer => customer.cpf === cpf);
    if(!customer){
        return response.status(400).json({error: "Customer Not Found!"})
    }
    request.customer = customer;
    return next();
}


app.post("/account", (request, response) => {
    const {cpf, name} = request.body;
    const customersAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if(customersAlreadyExists){
        return response.status(400).json({error: "Customer Alredy Exists!"});
    }
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();
    
});
//app.use(middleWare) - >todas as rotas utilizam
//app.get("/recurso", middleware1, (req, res) => {}) -> so essa rota utiliza

app.get("/statement", verifyIfExistsAccountCpf,  (request, response) => {
    const { customer } = request;
    
    return response.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCpf, (request, response) => {
    const {description, ammount} = request.body;
    const {customer} = request;
    const statementOperation = {
        description,
        ammount,
        created_at: new Date(),
        type: "credit"
    }
    customer.statement.push(statementOperation);
    return response.status(201).send();
})

app.listen(1313)
