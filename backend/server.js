const express      = require('express');
const app          = express();
const sass         = require('node-sass-middleware');
const bodyParser   = require('body-parser');
const fs           = require('fs');
const busboy       = require('connect-busboy');
const mysql        = require('mysql');
const fse          = require('fs-extra')
const cons         = require('consolidate');
const cors         = require('cors');

// view engine setup
app.engine('html', cons.swig)
app.set('view engine', 'html');

app.use(express.static(__dirname + "/frontbundle"));


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(busboy());  

app.use(cors());
app.options('*', cors());

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Storage'
});

con.connect((err) => {
    if(err) console.error(err);
    console.log('Connected!');
    con.query(`CREATE DATABASE IF NOT EXISTS Storage`, (err, result) => {
        if(err) console.error(err);
        console.log('Database was created!');
        const sql = `CREATE TABLE IF NOT EXISTS Files (
            id        INTEGER(64) UNIQUE AUTO_INCREMENT,
            Name      VARCHAR(128),
            Extension VARCHAR(32)
        )`;
        con.query(sql, (err, result) => {
            if(err) console.error(err);
            console.log('Table Files was created!');
        });
    });
});


app.get('/', (req, res) => {
    res.render('index', {}); 
});

// загружает файл на сервер
app.post('/api/files/:folder', (req, res) => {
    const folder = req.params.folder;
    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Uploading: ${filename}`);
        const name = filename.slice(0, filename.lastIndexOf('.'));
        const extension = filename.slice(filename.lastIndexOf('.') + 1,);
        con.query(`SELECT * FROM Files WHERE Name=? AND Extension=? AND folder=?`, [name, extension, folder], (err, result) => {
            if(err) console.error(err);
            if(result.length === 0) {
                const sql = `INSERT INTO Files (Name, Extension, folder) VALUES (?, ?, ?)`;
                con.query(sql, [name, extension, folder], (err) => {
                if(err) console.error(err);
                console.log('File was added!');
                })
                const fstream = fs.createWriteStream(`./files/${folder}/` + filename);
                file.pipe(fstream);
                fstream.on('close', () => {
                    res.redirect('back');
                })
            } 
            else res.status(400).send();
        })
    });
});

// создает новую папку
app.post('/api/newfolder', (req, res) => {
    const folderName = req.body.folderName;
    fs.mkdir(`./files/${folderName}`, (err) => {
        if(!err) {
            const sql = `INSERT INTO folders (name) VALUES (?)`
            con.query(sql, [folderName], (err) => {
                if(err) {
                    console.error(err);
                    res.status(404).send(err);
                }
                else res.status(200).send(err);
            });  
        }
        if(err && err.code === 'EEXIST') { 
            res.status(400).send(err);      
        }
    });   
});

// отображает все папки
app.get('/api/folder', (req, res) => {
    const sql = `SELECT * FROM folders`;
    con.query(sql, (err, result) => {
        if(err) {
            console.error(err);
            res.status(404).end();
        } 
        else res.status(200).send(JSON.stringify(result));
    })
    
});


// отображает файлы из папки
app.get('/api/folder/files/:id', (req, res) => {
    const name = req.params.id;
    const sql = `SELECT * FROM Files WHERE folder=?`;
    con.query(sql, [name], (err, result) => {
        if(err) {
            console.error(err);
            res.status(404).end();
        }
        else {
            console.log('Got files from the folder');
            res.status(200).send(JSON.stringify(result));
        }
    })   
})

// удаляет файл из папки
app.delete('/api/files', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const extension = req.body.extension;
    const folder = req.body.folder;
    const sql = `DELETE FROM Files WHERE Id=?`;
    con.query(sql, [id], (err) => {
        if(err) {
            console.error(err);
            res.status(404).end();
        } 
        else {
            fs.unlink(`./files/${folder}/${name}.${extension}`, (err) => {
                if(err) {
                    console.error(err);
                    res.status(404).end();
                }
                else {
                    console.log('File was deleted!');
                    res.status(200).end();   
                }
            });
            
        }
    });
});

// удаляет папку 
app.delete('/api/folder', (req, res) => {
    const folder = req.body.name;
    const sql = `DELETE FROM folders WHERE name=?`;
    con.query(sql, [folder], (err) => {
        if(err) {
            console.error(err);
            res.status(404).end();
        }
        else {
            fse.remove(`./files/${folder}`, (err) => {
                if(err) {
                    console.error(err);
                    res.status(404).end();
                }
                else {  
                    con.query(`SELECT * FROM Files WHERE folder=?`, [folder], (err, res) => {
                        if(err) {
                            console.error(err);
                            res.status(404).end()
                        } 
                        else if(res.length !== 0) {
                            return con.query(`DELETE FROM Files WHERE folder=?`, [folder], (err) => {
                                if(err) {
                                    console.error(err);
                                    res.status(404).end()
                                } 
                            })
                        }
                        else if(res.length === 0)
                            res.status(200).end();
                    })
                    
                }
            })
        }
    })
})

// скачивает файл на компьютер
app.get('/api/files/download', (req, res) => {
    const sql = `SELECT * FROM Files WHERE Name=? AND Extension=?`;
    con.query(sql, [req.query.filename, req.query.extension], (err, result) => {
        if(err) console.error(err);
        if(result.length > 0) {
            const fileName = '' + req.query.filename + '.' + req.query.extension;
            const filePath = `./files/${result[0].folder}/` + fileName;
            res.download(filePath, fileName, (err) => {
                if(err) {
                    console.error(err);
                    res.status(404).end();
                }
                else {
                    res.status(200).end();
                }
            });
        }
            
        else res.status(400).send();
    });
})

// перемещает файлы из папки в папку
app.post(`/api/:folder`, (req, res) => {
    const folder = req.params.folder;

    for(let key in req.body) {
        const oldF = key;
        const file = req.body[key];
        fse.move(`./files/${oldF}/${file}`, `./files/${folder}/${file}`, (err) => {
            if(err) {
                console.error(err);
                res.status(404).end();
            }
            else {
                const sql = `UPDATE Files SET folder=? WHERE NAME=? AND Extension=?`;
                con.query(sql, [folder, file.slice(0, file.lastIndexOf('.')), file.slice(file.lastIndexOf('.')+ 1, )], (err) => {
                    if(err) {
                        console.error(err);
                        res.status(404).end();
                    }
                    else res.status(200).end();
                })
                res.status(200).end();
            }
        })
    }
})



