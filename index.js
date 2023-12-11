import express from "express";
import Sequelize from 'sequelize';
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
//connection
const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './Hospital.db',
    logging: false
});

connection.authenticate().then(() => {
    console.log("Successfully we are connected with the database");
}).catch(function (error) {
    console.log(error);
});

//Models

const PatientSchema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.NUMBER
    }
};

const Pat = connection.define('pat', PatientSchema, { timestamps: false, freezeTableName: true });

const DoctorSchema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    specialization: {
        type: Sequelize.STRING
    }
}

const Doc = connection.define('doc', DoctorSchema, { timestamps: false, freezeTableName: true });

const AppointmentSchema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateTime: {
        type: Sequelize.DATEONLY
    },
    status: {
        type: Sequelize.BOOLEAN
    },
    Doc_id: {
        type: Sequelize.INTEGER
    },
    Pat_id: {
        type: Sequelize.INTEGER
    }


}

const Appt = connection.define('appt', AppointmentSchema, { timestamps: false, freezeTableName: true });
//Pat.belongsTo(Appt, { foreignKey: 'Pat_id' })
//Doc.belongsTo(Appt, { foreignKey: 'Doc_id' })

connection.sync();
//connection.sync({ alter: true })

//routes
app.get('/', (req, res) => {
    res.render('main')
})
//patientsRoutes
app.get('/patients', (req, res) => {
    Pat.findAll()
        .then((result) => {
            res.render('pat', { data: result });
        })
        .catch((err) => {
            console.log("Error in getting data from database");
        })

});

app.get('/patients/:id', (req, res)=>{
    Pat.findOne({where: {id: req.params.id}})
      .then((result)=>{
          res.send(result);
      })
      .catch((err)=>{
          console.log(err);
      })
  });

app.get('/addpat', (req, res) => {
    res.render('addpat');
})

app.post('/addpat', (req, res) => {
    Pat.build(req.body)
        .save()
        .then((result) => {
            res.redirect("/patients")
        })
        .catch((err) => {
            console.log(err);
        })
})
app.get('/deletepat/:id', (req, res) => {
    Pat.destroy({ where: { id: req.params.id } })
        .then((result) => {
            res.redirect("/patients")
        });
})
app.get('/updatepat/:id', (req, res) => {
    Pat.findOne({ where: { id: req.params.id } })
        .then((result) => {
            res.render('updatepat', { success: true, data: result });
        }).catch((err) => console.log(err));
})
app.post('/updatepat/:id', (req, res) => {
    Pat.update(req.body
        , { where: { id: req.params.id } })
        .then((result) => {
            res.redirect("/patients");
        })
        .catch((err) => {
            req.body.id = req.params.id;
            res.render('updatepat', { success: false, data: req.body, msg: err.message });
        });

});
//doctorRoutes
app.get('/doctors', (req, res) => {
    Doc.findAll()
        .then((result) => {
            res.render('doc', { data: result });
        })
        .catch((err) => {
            console.log("Error in getting data from database");
        })

});
app.get('/doctors/:id', (req, res)=>{
    Doc.findOne({where: {id: req.params.id}})
      .then((result)=>{
          res.send(result);
      })
      .catch((err)=>{
          console.log(err);
      })
  });

app.get('/adddoc', (req, res) => {
    res.render('adddoc');
})

app.post('/adddoc', (req, res) => {
    Doc.build(req.body)
        .save()
        .then((result) => {
            res.redirect("/doctors")
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/deletedoc/:id', (req, res) => {
    Doc.destroy({ where: { id: req.params.id } })
        .then((result) => {
            res.redirect("/doctors");
        })
});

app.get('/updatedoc/:id', (req, res) => {
    Doc.findOne({ where: { id: req.params.id } })
        .then((result) => {
            res.render('updatedoc', { success: true, data: result });
        }).catch((err) => console.log(err));
})
app.post('/updatedoc/:id', (req, res) => {
    Doc.update(req.body
        , { where: { id: req.params.id } })
        .then((result) => {
            res.redirect("/doctors");
        })
        .catch((err) => {
            req.body.id = req.params.id;
            res.render('updatedoc', { success: false, data: req.body, msg: err.message });
        });
})
//AppointmentRoutes
app.get('/appointment', (req, res) => {
    Appt.findAll()
        .then((result) => {
            res.render('appt', {
                data: result
            })
        })
        .catch((err) => {
            console.log(err);
        })
})
app.get('/appointment/:id', (req, res)=>{
    Appt.findOne({where: {id: req.params.id}})
      .then((result)=>{
          res.send(result);
      })
      .catch((err)=>{
          console.log(err);
      })
  });
app.get('/addappt', (req, res) => {
    res.render('addappt')
})

app.post('/addappt', (req, res) => {
    Appt.build(req.body).save().then((result) => {
        res.redirect('/appointment');
    }).catch((err) =>
        console.log(err))
})

app.get('/updateappt/:id', (req, res) => {
    Appt.findOne({ where: { id: req.params.id } })
        .then((result) => {
            res.render('updateappt', { success: true, data: result });
        }).catch((err) => console.log(err));
})
app.post('/updateappt/:id', (req, res) => {
    Appt.update(req.body
        , { where: { id: req.params.id } })
        .then((result) => {
            res.redirect("/appointment");
        })
        .catch((err) => {
            req.body.id = req.params.id;
            res.render('updateappt', { success: false, data: req.body, msg: err.message });
        });
})
app.get('/deleteappt/:id', (req, res) => {
    Appt.destroy({ where: { id: req.params.id } })
        .then((result) => {
            res.redirect("/appointment");
        })
        .catch((err) => {
            console.log(err);
        });
});

//
app.listen(8080, () => {
    console.log("Server is running on port 8080");

});
