const express = require("express");
const ruta = express.Router(); // Mejor usar express.Router() aquí
const conexion = require('../config/conexion');
const bodyParser = require('body-parser');

ruta.use(bodyParser.json());

// Ruta base para probar si la API está funcionando
ruta.get('/', function (req, res) {
    res.json({ mensaje: '¡Estoy en Index!' });
});

// Obtener de la tabla customers
ruta.get('/customers', (req, res) => {
    const sql = 'SELECT * FROM customers order by customerNumber';
    conexion.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No hay resultados');
        }
    });
});

// obtener tabla customers y mostrar el array con las orders de cada customer
ruta.get('/customers/orders', (req, res) => {
    const sql = 'SELECT * FROM customers order by customerNumber';
    conexion.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            results.forEach(customer => {
                const sql = `SELECT * FROM orders WHERE customerNumber = ${customer.customerNumber}`;
                conexion.query(sql, (error, orders) => {
                    if (error) throw error;
                    customer.orders = orders;
                    if (results.indexOf(customer) === results.length - 1) {
                        res.json(results);
                    }
                });
            });
        } else {
            res.send('No hay resultados');
        }
    });
});

// Obtener un customer por su customerNumber
ruta.get('/customers/:customerNumber', (req, res) => {
    const { customerNumber } = req.params;
    const sql = `SELECT * FROM customers WHERE customerNumber =
      ${customerNumber}`;
    conexion.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('No hay resultados');
        }
    }
    );
}
);


/*ruta.get('/customers/:customerNumber/orders', (req, res) => {
    const { customerNumber } = req.params;
    const sql = `SELECT * FROM customers WHERE customerNumber = ${customerNumber}`;
    conexion.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            const sql = `SELECT * FROM orders WHERE customerNumber = ${customerNumber}`;
            conexion.query(sql, (error, orders) => {
                if (error) throw error;
                result[0].orders = orders;
                res.json(result);
            });
        } else {
            res.send('No hay resultados');
        }
    });
}
);*/


ruta.get('/customers/:customerNumber/orders', (req, res) => {
    const { customerNumber } = req.params;
    const sqlCustomer = `SELECT * FROM customers WHERE customerNumber = ${customerNumber}`;
    conexion.query(sqlCustomer, (error, customerResult) => {
        if (error) throw error;
        if (customerResult.length > 0) {
            const sqlOrders = `SELECT * FROM orders WHERE customerNumber = ${customerNumber}`;
            conexion.query(sqlOrders, (error, ordersResult) => {
                if (error) throw error;
                if (ordersResult.length > 0) {
                    let ordersProcessed = 0;
                    ordersResult.forEach((order, index) => {
                        const sqlOrderTotal = `SELECT SUM(priceEach * quantityOrdered) AS total FROM orderdetails WHERE orderNumber = ${order.orderNumber}`;
                        conexion.query(sqlOrderTotal, (error, totalResult) => {
                            if (error) throw error;
                            ordersResult[index].total = totalResult[0].total || 0;
                            ordersProcessed++;
                            if (ordersProcessed === ordersResult.length) {
                                customerResult[0].orders = ordersResult;
                                res.json(customerResult);
                            }
                        });
                    });
                } else {
                    res.send('El cliente no tiene órdenes.');
                }
            });
        } else {
            res.send('No se encontró el cliente.');
        }
    });
});




// Añadir un nuevo customer 
ruta.post('/customers', (req, res) => {
    const sql = 'INSERT INTO customers SET ?';
    const customerObj = {
        customerNumber: req.body.customerNumber,
        customerName: req.body.customerName,
        contactLastName: req.body.contactLastName,
        contactFirstName: req.body.contactFirstName,
        phone: req.body.phone,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
        salesRepEmployeeNumber: req.body.salesRepEmployeeNumber,
        creditLimit: req.body.creditLimit
    };
    conexion.query(sql, customerObj, error => {
        if (error) throw error;
        res.send('Customer creado!');
    });
});

// Actualizar un customer
ruta.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { customerNumber, customerName, contactLastName, contactFirstName, phone, addressLine1, addressLine2, city, state, postalCode, country, salesRepEmployeeNumber, creditLimit } = req.body;
    const sql = `UPDATE customers SET customerNumber = '${customerNumber}', customerName = '${customerName}', contactLastName = '${contactLastName}', contactFirstName = '${contactFirstName}', phone = '${phone}', addressLine1 = '${addressLine1}', addressLine2 = '${addressLine2}', city = '${city}', state = '${state}', postalCode = '${postalCode}', country = '${country}', salesRepEmployeeNumber = '${salesRepEmployeeNumber}', creditLimit = '${creditLimit}' WHERE id =${id}`;
    conexion.query(sql, error => {
        if (error) throw error;
        res.send('Customer actualizado!');
    });
});

// Eliminar un customer
ruta.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM customers WHERE id= ${id}`;
    conexion.query(sql, error => {
        if (error) throw error;
        res.send('Customer eliminado!');
    });
});

module.exports = ruta;