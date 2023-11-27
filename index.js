import express from 'express';
import fs from 'fs';
import natural from 'natural';

import cors from 'cors';
const app = express();
const port = 3000;
app.use(cors()); // Middleware để xử lý dữ liệu JSON

app.use(express.json());
class NLP {
    constructor() {
        this.nlp = new natural.BayesClassifier();
        this.arr1 = [];
        this.arr2 = [];
        this.arr3 = [];
    }

    readFileNegative(path = "./data/negative.txt") {
        const data = fs.readFileSync(path, 'utf8');
        const lines = data.split(';');
        lines.forEach(element => {
            this.arr1.push(element);
        });
        return this.arr1;
    }

    readFileNeutral(path = "./data/neutral.txt") {
        const data = fs.readFileSync(path, 'utf8');
        const lines = data.split(';');
        lines.forEach(element => {
            this.arr2.push(element);
        });
        return this.arr2;
    }

    readFilePositive(path = "./data/positive.txt") {
        const data = fs.readFileSync(path, 'utf8');
        const lines = data.split(';');
        lines.forEach(element => {
            this.arr3.push(element);
        });
        return this.arr3;
    }

    trainNegative() {
        this.arr1.forEach(element => {
            this.nlp.addDocument(element, 'negative');
        });
        try {
            this.nlp.train();
        } catch (err) {
            console.log(err);
        }
    }

    trainNeutral() {
        this.arr2.forEach(element => {
            this.nlp.addDocument(element, 'neutral');
        });
        try {
            this.nlp.train();
        } catch (err) {
            console.log(err);
        }
    }

    trainPositive() {
        this.arr3.forEach(element => {
            this.nlp.addDocument(element, 'positive');
        });
        try {
            this.nlp.train();
        } catch (err) {
            console.log(err);
        }
    }

    classify(text) {
        console.log(text);
        return this.nlp.classify(text);
    }

    result(text) {
        if (this.nlp.classifier(text) === "negative") {
            console.log("false");
            return false;
        } else {
            console.log("true");
            return true;
        }
    }
}

const nlp = new NLP();
nlp.readFileNegative();
nlp.readFileNeutral();
nlp.readFilePositive();
nlp.trainNegative();
nlp.trainNeutral();
nlp.trainPositive();

app.get('/classify', (req, res) => {
    //const text = req.query.text;
    const text = req.body.text;
const result = nlp.classify(text);
    res.json({ result });
});

app.post('/classify', (req, res) => {
    const text = req.body.text; // Lấy dữ liệu text từ body của yêu cầu
    console.log(text);
    const result = nlp.classify(text);
    res.json({ result });
});

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});