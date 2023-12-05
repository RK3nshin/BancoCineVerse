const express = require("express");
const { Client } = require('pg');
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
var conString = config.urlConnection;
var client = new Client(conString);
client.connect(function(err) {
 if(err) {
 return console.error('Não foi possível conectar ao banco.', err);
 }
 client.query('SELECT NOW()', function(err, result) {
 if(err) {
 return console.error('Erro ao executar a query.', err);
 }
 console.log(result.rows[0]);
 });
});
app.get("/", (req, res) => {
    console.log("Response ok.");
    res.send("Ok – Servidor disponível.");
   });
   app.listen(config.port, () =>
    console.log("Servidor funcionando na porta " + config.port)
   );
   app.get("/CineUsuarios", (req, res) => {
    try {
        client.query("SELECT * FROM CineUsuarios", (err, result) => {
            if (err) {
                return console.error("Erro ao executar a qry de SELECT", err);
            }
            res.send(result.rows);
            console.log("Rota: get CineUsuarios");
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/CineUsuarios/:id_CineUsuario", (req, res) => {
    try {
        console.log("Rota: CineUsuarios/" + req.params.id_CineUsuario);
        client.query(
            "SELECT * FROM CineUsuarios WHERE id_CineUsuario = $1", 
            [req.params.id_CineUsuario], // Corrigido para req.params.id_CineUsuario
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de SELECT id", err);
                }
                res.send(result.rows);
                //console.log(result);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

   // Rota de DELETE
app.delete("/CineUsuarios/:id_CineUsuario", (req, res) => {
    try {
        console.log("Rota: delete/" + req.params.id_CineUsuario);
        client.query(
            "DELETE FROM CineUsuarios WHERE id_CineUsuario = $1", 
            [req.params.id_CineUsuario], 
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de DELETE", err);
                } else {
                    if (result.rowCount == 0) {
                        res.status(404).json({ info: "Registro não encontrado." });
                    } else {
                        res.status(200).json({ info: `Registro excluído. Código: ${req.params.id_CineUsuario}` });
                    }
                }
                console.log(result);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

// Rota de POST
app.post("/CineUsuarios", (req, res) => {
    try {
        console.log("Alguém enviou um post com os dados:", req.body);
        const { nome, email, senha } = req.body;
        client.query(
            "INSERT INTO CineUsuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING * ",
            [nome, email, senha],
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de INSERT", err);
                }
                const { id_CineUsuario } = result.rows[0];
                res.setHeader("id_CineUsuario", `${id_CineUsuario}`);
                res.status(201).json(result.rows[0]);
                console.log(result);
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

// Rota de PUT (UPDATE)
app.put("/CineUsuarios/:id_CineUsuario", (req, res) => {
    try {
        console.log("Alguém enviou um update com os dados:", req.body);
        const id_CineUsuario = req.params.id_CineUsuario;
        const { nome, email, senha } = req.body;
        client.query(
            "UPDATE CineUsuarios SET nome=$1, email=$2, senha=$3 WHERE id_CineUsuario =$4 ",
            [nome, email, senha, id_CineUsuario],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de UPDATE", err);
                } else {
                    res.setHeader("id_CineUsuario", id_CineUsuario);
                    res.status(202).json({ "identificador": id_CineUsuario });
                    console.log(result);
                }
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});


app.get("/Filmes", (req, res) => {
    try {
        client.query("SELECT * FROM Filmes", (err, result) => {
            if (err) {
                return console.error("Erro ao executar a qry de SELECT para Filmes", err);
            }
            res.send(result.rows);
            console.log("Rota: get Filmes");
        });
    } catch (error) {
        console.log(error);
    }
});


app.get("/Filmes/:id_filme", (req, res) => {
    try {
        console.log("Rota: Filmes/" + req.params.id_filme);
        client.query(
            "SELECT * FROM Filmes WHERE id_filme = $1", 
            [req.params.id_filme],
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de SELECT para um filme", err);
                }
                res.send(result.rows);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.delete("/Filmes/:id_filme", (req, res) => {
    try {
        console.log("Rota: delete/Filmes/" + req.params.id_filme);
        client.query(
            "DELETE FROM Filmes WHERE id_filme = $1", 
            [req.params.id_filme], 
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de DELETE para Filmes", err);
                } else {
                    if (result.rowCount == 0) {
                        res.status(404).json({ info: "Registro não encontrado." });
                    } else {
                        res.status(200).json({ info: `Registro excluído. Código: ${req.params.id_filme}` });
                    }
                }
                console.log(result);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.post("/Filmes", (req, res) => {
    try {
        console.log("Alguém enviou um post com os dados:", req.body);
        const { titulo, sinopse, faixa_etaria, duracao, URL_Imagem } = req.body;
        client.query(
            "INSERT INTO Filmes (titulo, sinopse, faixa_etaria, duracao, URL_Imagem) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
            [titulo, sinopse, faixa_etaria, duracao, URL_Imagem],
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de INSERT para Filmes", err);
                }
                const { id_filme } = result.rows[0];
                res.setHeader("id_filme", `${id_filme}`);
                res.status(201).json(result.rows[0]);
                console.log(result);
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

app.put("/Filmes/:id_filme", (req, res) => {
    try {
        console.log("Alguém enviou um update com os dados:", req.body);
        const id_filme = req.params.id_filme;
        const { titulo, sinopse, faixa_etaria, duracao, URL_Imagem } = req.body;
        client.query(
            "UPDATE Filmes SET titulo=$1, sinopse=$2, faixa_etaria=$3, duracao=$4, URL_Imagem=$5 WHERE id_filme =$6 ",
            [titulo, sinopse, faixa_etaria, duracao, URL_Imagem, id_filme],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de UPDATE para Filmes", err);
                } else {
                    res.setHeader("id_filme", id_filme);
                    res.status(202).json({ "identificador": id_filme });
                    console.log(result);
                }
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});



app.get("/Ingresso", (req, res) => {
    try {
        client.query("SELECT * FROM Ingresso", (err, result) => {
            if (err) {
                return console.error("Erro ao executar a qry de SELECT para Ingresso", err);
            }
            res.send(result.rows);
            console.log("Rota: get Ingresso");
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/Ingresso/:id_reserva", (req, res) => {
    try {
        console.log("Rota: Ingresso/" + req.params.id_reserva);
        client.query(
            "SELECT * FROM Ingresso WHERE id_reserva = $1", 
            [req.params.id_reserva],
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de SELECT para um ingresso", err);
                }
                res.send(result.rows);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.delete("/Ingresso/:id_reserva", (req, res) => {
    try {
        console.log("Rota: delete/Ingresso/" + req.params.id_reserva);
        client.query(
            "DELETE FROM Ingresso WHERE id_reserva = $1", 
            [req.params.id_reserva], 
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de DELETE para Ingresso", err);
                } else {
                    if (result.rowCount == 0) {
                        res.status(404).json({ info: "Registro não encontrado." });
                    } else {
                        res.status(200).json({ info: `Registro excluído. Código: ${req.params.id_reserva}` });
                    }
                }
                console.log(result);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.post("/Ingresso", (req, res) => {
    try {
        console.log("Alguém enviou um post com os dados:", req.body);
        const { id_CineUsuario, numero_assento, preco_total, Horario } = req.body;
        client.query(
            "INSERT INTO Ingresso (id_CineUsuario, numero_assento, preco_total, Horario) VALUES ($1, $2, $3, $4) RETURNING * ",
            [id_CineUsuario, numero_assento, preco_total, Horario],
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de INSERT para Ingresso", err);
                }
                const { id_reserva } = result.rows[0];
                res.setHeader("id_reserva", `${id_reserva}`);
                res.status(201).json(result.rows[0]);
                console.log(result);
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

app.put("/Ingresso/:id_reserva", (req, res) => {
    try {
        console.log("Alguém enviou um update com os dados:", req.body);
        const id_reserva = req.params.id_reserva;
        const { id_CineUsuario, numero_assento, preco_total, Horario } = req.body;
        client.query(
            "UPDATE Ingresso SET id_CineUsuario=$1, numero_assento=$2, preco_total=$3, Horario=$4 WHERE id_reserva =$5 ",
            [id_CineUsuario, numero_assento, preco_total, Horario, id_reserva],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de UPDATE para Ingresso", err);
                } else {
                    res.setHeader("id_reserva", id_reserva);
                    res.status(202).json({ "identificador": id_reserva });
                    console.log(result);
                }
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

app.get("/SalasDeCinema", (req, res) => {
    try {
        client.query("SELECT * FROM SalasDeCinema", (err, result) => {
            if (err) {
                return console.error("Erro ao executar a qry de SELECT para SalasDeCinema", err);
            }
            res.send(result.rows);
            console.log("Rota: get SalasDeCinema");
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/SalasDeCinema/:id_sala", (req, res) => {
    try {
        console.log("Rota: SalasDeCinema/" + req.params.id_sala);
        client.query(
            "SELECT * FROM SalasDeCinema WHERE id_sala = $1", 
            [req.params.id_sala],
            (err, result) => {
                if (err) {
                    return console.error("Erro ao executar a qry de SELECT para uma sala de cinema", err);
                }
                res.send(result.rows);
            }
        );
    } catch (error) {
        console.log(error);
    }
});




module.exports = app; 