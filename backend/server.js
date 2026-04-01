const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let applications = [];

const calculateScore = (data) => {
    let score = 0;
    if (data.motivation && data.motivation.length > 50) score += 1;
    if (data.portfolio && data.portfolio.includes('https')) score += 1;
    if (data.email && data.email.includes('@')) score +=1;
    return score;
}

app.post('/applications', (req, res) => {
    const { nom, email, role, motivation } = req.body;

    if (!nom || !email || !role || !motivation) {
        return res.status(400).json({ error: "Tous les champs obligatoires ne sont pas remplis."})
    }

    const newApplication = {
        ...req.body,
        id: Date.now(),
        score: calculateScore(req.body),
        date: new Date().toLocaleDateString()
    };

    applications.push(newApplication);
    res.status(201).json(newApplication);
});

app.get('/applications', (req, res) => {
    res.json(applications);
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur prêt sur http://localhost:${PORT}`));