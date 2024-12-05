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

const avisoSchema = mongoose.Schema({
    texto: { type: String, required: true }
});
const Aviso = mongoose.model("Aviso", avisoSchema);

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
    console.log("Requisição de login recebida:", req.body); 

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
        console.error("Erro ao processar login:", error); 
        res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
});

// Rota para obter o texto dos avisos
app.get('/avisos', async (req, res) => {
    try {
        const aviso = await Aviso.findOne();
        res.status(200).json(aviso || { texto: '' });
    } catch (error) {
        console.error("Erro ao buscar avisos:", error);
        res.status(500).json({ mensagem: 'Erro ao buscar avisos.' });
    }
});

// Rota para salvar o texto dos avisos
app.post('/avisos', async (req, res) => {
    const { texto } = req.body;
    try {
        let aviso = await Aviso.findOne();
        if (aviso) {
            aviso.texto = texto;
        } else {
            aviso = new Aviso({ texto });
        }
        await aviso.save();
        res.status(200).json({ mensagem: 'Avisos salvos com sucesso!' });
    } catch (error) {
        console.error("Erro ao salvar avisos:", error);
        res.status(500).json({ mensagem: 'Erro ao salvar avisos.' });
    }
});

// Schema para receber o formulário de perguntas
const questionSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    question: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const Question = mongoose.model('Question', questionSchema);

// Rota para salvar perguntas
app.post('/questions', async (req, res) => {
    const { name, email, question } = req.body;

    try {
        const newQuestion = new Question({ name, email, question });
        await newQuestion.save();
        res.status(200).json({ message: 'Dúvida salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar dúvida:', error);
        res.status(500).json({ message: 'Erro ao salvar dúvida.' });
    }
});
