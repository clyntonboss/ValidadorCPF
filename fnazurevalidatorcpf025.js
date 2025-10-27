const { app } = require('@azure/functions');

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,''); // Remove tudo que não for número
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