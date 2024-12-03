// mongodb+srv://evandroferraz:1234@cluster0.vev20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// npm install --legacy-peer-deps
// npm start
const express = require ('express')
const app = express()
app.use(express.json())

const cors = require ('cors')
app.use(cors())
const mongoose = require('mongoose')

const uniqueValidator = require("mongoose-unique-validator")
const usuarioSchema = mongoose.Schema({
    login: {type: String, required: true, unique: true},
    senha: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

const conectarAoMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://projetointegradorfrontend:KUJRCnaIniy0Dct5@cluster-pi.biv5n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-PI', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conectado ao MongoDB");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB", error);
    }
};

app.listen(3000, () => {
    try{
        conectarAoMongoDB()
        console.log("up and running")
    }catch(e){
        console.log("Erro", e)
    }
})

const jwt = require("jsonwebtoken")
//POST http://localhost:3000/login
app.post('/login', async (req, res) => {
    console.log("Requisição de login recebida"); // Adicionar log
    //login/senha que o usuário enviou
    const login = req.body.login
    const senha = req.body.senha
    console.log("Dados recebidos:", login, senha); // Adicionar log
    //tentamos encontrar no MongoDB
    const u = await Usuario.findOne({login: req.body.login})
    if(!u){
        //senão foi encontrado, encerra por aqui com código 401
        return res.status(401).json({mensagem: "login inválido"})
    }
    //se foi encontrado, comparamos a senha, após descriptográ-la
    const senhaValida = await bcrypt.compare(senha, u.senha)
    if (!senhaValida){
        return res.status(401).json({mensagem: "senha inválida"})
    }
    // Se chegamos nessa linha, então usuário válido.
    const token = jwt.sign(
        {login: login},
        "chave-secreta",
        {expiresIn: "1h"}
    )
    res.status(200).json({token: token})
})