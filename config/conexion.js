//--- Conexion a al BD MySQL
//se carga el paquete o llama a la dependencia
const mysql = require('mysql');
const conexion = mysql.createConnection(
    {
        host:'mysql-mbalzav.alwaysdata.net',
        user:'mbalzav',
        password:'M4t3o1126.',
        database:'mbalzav_apinode'
    }

);
// se abre oa conexion a la BD
conexion.connect(
    err=>{
        if(err){
            console.log('Error al conectar a la BD: '+err)
        }
        else{
            console.log('Conectado exisotosamente a la BD')
        }

    }
);
// se exporta para ser usada en cualquier parte del proyecto
module.exports=conexion;