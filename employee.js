let employeeCollection;

class Employee {
    static async injectDB(conn) {
        employeeCollection = await conn.db("Office_VMS").collection("employee");
    }

    static async register(employeeno, firstname, lastname, age, gender, position) {
        // TODO: Check if Employeeno exists
        const res = await employeeCollection.findOne({ Employeeno: employeeno });

        if (res) {
            return { status: "duplicate Employeeno" };
        }

        // TODO: Save employee to database
        await employeeCollection.insertOne({
            "Employeeno": employeeno,
            "Firstname": firstname,
            "Lastname": lastname,
            "Age": age,
            "Gender": gender,
            "Position": position,                       
        });
        return { status: "Successfully register employee" };
    }

    static async update(employeeno, firstname, lastname, age, gender, position) {
        await employeeCollection.updateOne({ Employeeno: employeeno }, {
            $set: {
                "Firstname": firstname,
                "Lastname": lastname,
                "Age": age,
                "Gender": gender,       
                "Position": position,
            }
        });
        return { status: "Information updated" };
    }

    static async delete(employeeno) {
        await employeeCollection.deleteOne({ Employeeno: employeeno });
        return { status: "Employee deleted!" };
    }

    static async find(employeeno) {
        return employeeCollection.findOne({ Employeeno: employeeno });
    }
}

module.exports = Employee;
