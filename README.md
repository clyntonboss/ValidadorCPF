# Validador de CPF - Microserviço Serverless

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: DIO](https://img.shields.io/badge/Plataforma-DIO-blue)](https://digitalinnovation.one/)

Este projeto é parte do módulo **Microsoft Certification Challenge #4 - AZ-204**:
**Segurança e Gerenciamento de API / Criando um Microserviço Serverless para Validação de CPF**

O curso está sendo realizado na plataforma **DIO (Digital Innovation One)**.

---

## **Descrição**

Microserviço serverless desenvolvido com **Azure Functions** e **Node.js**, que valida CPFs enviados via query string ou corpo da requisição. Retorna mensagem indicando se o CPF informado é **Válido** ou **Inválido**.

**Objetivos do projeto:**

* Aprender criação de microserviços serverless
* Gerenciamento de APIs
* Segurança básica em endpoints públicos

---

## **Endpoint**

```
https://fnazurevalidatorcpf025.azurewebsites.net/api/validarcpf
```

* Aceita **GET** e **POST**.
* Para testar, adicione `?cpf=XXXXXXXXXXX` ao final do link ou envie o CPF no corpo da requisição.

**Exemplo GET:**

```
https://fnazurevalidatorcpf025.azurewebsites.net/api/validarcpf?cpf=77901566086
```

Resposta esperada:

```
O número do CPF informado é Válido!
```

**Exemplo GET com CPF inválido:**

```
https://fnazurevalidatorcpf025.azurewebsites.net/api/validarcpf?cpf=77901566087
```

Resposta:

```
O número do CPF informado é Inválido!
```

**Exemplo POST:**

* Corpo da requisição (raw/text/plain):

```
08231432795
```

Resposta:

```
O número do CPF informado é Válido!
```

---

## **Script da Função**

```javascript
const { app } = require('@azure/functions');

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

app.http('ValidarCPF', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const cpf = request.query.get('cpf') || await request.text();
        if(!cpf) {
            return { status: 400, body: 'Por favor, informe um CPF.' };
        }

        const valido = validarCPF(cpf);
        return {
            body: `O número do CPF informado é ${valido ? 'Válido' : 'Inválido'}!`
        };
    }
});
```

---

## **Observações**

* Teste sempre com CPFs válidos e inválidos.
* Endpoint público (`authLevel: anonymous`) → pode ser chamado de qualquer lugar.
* Este projeto é um **exercício de aprendizado**; ajustes de segurança são necessários antes de usar em produção.

---

## **Plataforma**

* **Curso:** Digital Innovation One (DIO)
* **Módulo:** Microsoft Certification Challenge #4 - AZ-204
* **Tópico:** Segurança e Gerenciamento de API / Microserviço Serverless

---

## **Licença**

* MIT License
