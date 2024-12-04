// mongodb+srv://evandroferraz:1234@cluster0.vev20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// npm install --legacy-peer-deps
// npm start
const express = require ('express')
const app = express()
app.use(express.json())
const bcrypt = require('bcrypt')

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
    const { login, senha } = req.body;
    console.log("Requisição de login recebida:", req.body); // Log para depuração

    try {
        const usuario = await Usuario.findOne({ login });
        if (!usuario) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: usuario._id }, 'seuSegredo', { expiresIn: '1h' });
        res.status(200).json({ mensagem: 'Login realizado com sucesso!', token });
    } catch (error) {
        console.error("Erro ao processar login:", error); // Log para depuração
        res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
});