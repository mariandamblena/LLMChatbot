const { postCompletion } = require("./chatLLM")
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(
        async (ctx, ctxFn) => {
            let messages = [
                { "role": "system", "content": "Eres un vendedor de neumaticos para autos y camiones, tienes que saber aspectos tecnicos sobre estos. Tu tarea principal es generar una query sql basada en la consulta que realicen los clientes sobre neumaticos para auto. para ello tendras que preguntar las medidas y la marca. usa estos comandos sql de la tabla como referencia CREATE TABLE NeumaticosAutos (neumatico_id INT PRIMARY KEY AUTO_INCREMENT,medida VARCHAR(50),marca VARCHAR(50)); solo quiero que devuelvas la query sin ningun texto adicional ni explicacion " },
                { "role": "user", "content": ctx.body }
            ]
            const answer = await postCompletion(messages);
            console.log("Answer: ", answer);
            await ctxFn.flowDynamic(answer);
        })

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
