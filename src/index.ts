import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { TTaskDB, TTaskWithUsers, TUserDB, TUserTaskDB } from './types'



const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

//Cod simples

// app.get("/ping", async (req: Request, res: Response) => {
//     try {
//         res.status(200).send({ message: "Pong!" })
//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })


// refazendo o cod com o uso da async e await
// Retornando todos os usuários e uma mensangem*-
app.get("/ping", async (req: Request, res: Response) => {
    try {
				const result = await db("users")
        res.status(200).send({ message: "Pong!", result })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Retornando os usuários
app.get("/users", async (req: Request, res: Response) => {
    try {
				const resultUsers = await db("users")
        res.status(200).send({ message: "Users", resultUsers })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// Refatorando o codigo com async
app.post("/users", async(req: Request, res: Response)=>{
    try{
        const {id, name, email, password}= req.body
        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' inválido, deve ser uma string");
            
        }
        if(typeof email !== "string"){
            res.status(400)
            throw new Error("'email' inválido, deve ser uma string");
            
        }
        if(typeof name !== "string"){
            res.status(400)
            throw new Error("'nome' inválido, deve ser uma string");
            
        }
        if(typeof password !== "string"){
          res.status(400)
          throw new Error("'password' inválido, deve ser uma string");
          
      }
        if(id.length <1 || name.length < 1 || email.length < 1 || password.length <1){
            res.status(400)
            throw new Error("'id', 'nome', 'password' e 'email' devem ter no minímo 1 caractere");
            
        }
       
        await db.raw(`
        INSERT INTO users(id, name, email, password)
        VALUES("${id}", "${name}","${email}", "${password}");`)
        res.status(200).send(`usuário cadastrada com sucesso`)
    }catch (error) {
        console.log(error)
  
        if (req.statusCode === 200) {
            res.status(500)
        }
  
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }}});


        // DELETE user by id
        app.delete("/users/:id", async (req: Request, res: Response) => {
            try {
                const idToDelete = req.params.id
        
                const [ user ] = await db("users").where({ id: idToDelete })
        
                if (user) {
                    await db("users").del().where({ id: idToDelete })
                } else {
                    res.status(404)
                    throw new Error("'id' não encontrada")
                }
        
                res.status(200).send({ message: "Usuário deletada com sucesso" })
            } catch (error) {
                console.log(error)
        
                if (req.statusCode === 200) {
                    res.status(500)
                }
        
                if (error instanceof Error) {
                    res.send(error.message)
                } else {
                    res.send("Erro inesperado")
                }
            }
        })
        
        //get all tasks
        app.get("/tasks", async (req: Request, res: Response) => {
            try {
                        const resultTasks = await db("tasks")
                res.status(200).send({ message: "tasks", resultTasks })
            } catch (error) {
                console.log(error)
        
                if (req.statusCode === 200) {
                    res.status(500)
                }
        
                if (error instanceof Error) {
                    res.send(error.message)
                } else {
                    res.send("Erro inesperado")
                }
            }
        })
        
        //post para tasks
        app.post("/tasks", async(req: Request, res: Response)=>{
            try{
                const {id, title, description }= req.body
                if(typeof id !== "string"){
                    res.status(400)
                    throw new Error("'id' inválido, deve ser uma string");
                    
                }
                if(typeof title !== "string"){
                    res.status(400)
                    throw new Error("'title' inválido, deve ser uma string");
                    
                }
                if(typeof description !== "string"){
                    res.status(400)
                    throw new Error("'descrição' inválido, deve ser uma string");
                    
                }
               
                if(id.length <1  || title.length < 1 ){
                    res.status(400)
                    throw new Error("'id', 'title' devem ter no minímo 1 caractere");
                    
                }
               
                await db.raw(`
                INSERT INTO tasks(id, title, description)
                VALUES("${id}", "${title}","${description}");`)
                res.status(200).send(`task cadastrada com sucesso`)
            }catch (error) {
                console.log(error)
          
                if (req.statusCode === 200) {
                    res.status(500)
                }
          
                if (error instanceof Error) {
                    res.send(error.message)
                } else {
                    res.send("Erro inesperado")
                }}});
        
                //Deletar tasks por id
                app.delete("/tasks/:id", async (req: Request, res: Response) => {
                    try {
                        const idToDelete = req.params.id
                
                        const [ task ] = await db("tasks").where({ id: idToDelete })
                
                        if (task) {
                            await db("tasks").del().where({ id: idToDelete })
                        } else {
                            res.status(404)
                            throw new Error("'id' não encontrada")
                        }
                
                        res.status(200).send({ message: "task deletada com sucesso" })
                    } catch (error) {
                        console.log(error)
                
                        if (req.statusCode === 200) {
                            res.status(500)
                        }
                
                        if (error instanceof Error) {
                            res.send(error.message)
                        } else {
                            res.send("Erro inesperado")
                        }
                    }
                })
                

                

app.post("/tasks/:taskId/users/:userId", async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId
        const userId = req.params.userId

        if (taskId[0] !== "t") {
            res.status(400)
            throw new Error("'taskId' deve iniciar com a letra 't'")
        }

        if (userId[0] !== "f") {
            res.status(400)
            throw new Error("'userId' deve iniciar com a letra 'f'")
        }

        const [ task ]: TTaskDB[] | undefined[] = await db("tasks").where({ id: taskId })

        if (!task) {
            res.status(404)
            throw new Error("'taskId' não encontrado")
        }

        const [ user ]: TUserDB[] | undefined[] = await db("users").where({ id: userId })

        if (!user) {
            res.status(404)
            throw new Error("'userId' não encontrado")
        }

        const newUserTask: TUserTaskDB = {
            task_id: taskId,
            user_id: userId
        }

        await db("users_tasks").insert(newUserTask)

        res.status(201).send({ message: "User atribuído à tarefa com sucesso" })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/tasks/:taskId/users/:userId", async (req: Request, res: Response) => {
    try {
        const taskIdToDelete = req.params.taskId
        const userIdToDelete = req.params.userId

        if (taskIdToDelete[0] !== "t") {
            res.status(400)
            throw new Error("'taskId' deve iniciar com a letra 't'")
        }

        if (userIdToDelete[0] !== "f") {
            res.status(400)
            throw new Error("'userId' deve iniciar com a letra 'f'")
        }

        const [ task ]: TTaskDB[] | undefined[] = await db("tasks").where({ id: taskIdToDelete })

        if (!task) {
            res.status(404)
            throw new Error("'taskId' não encontrado")
        }

        const [ user ]: TUserDB[] | undefined[] = await db("users").where({ id: userIdToDelete })

        if (!user) {
            res.status(404)
            throw new Error("'userId' não encontrado")
        }

        await db("users_tasks").del()
            .where({ task_id: taskIdToDelete })
            .andWhere({ user_id: userIdToDelete })

        res.status(200).send({ message: "User removido da tarefa com sucesso" })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/tasks/users", async (req: Request, res: Response) => {
    try {
        // const result = await db("tasks")
        //     .select(
        //         "tasks.id AS taskId",
        //         "title",
        //         "description",
        //         "created_at AS createdAt",
        //         "status",
        //         "user_id AS userId",
        //         "name",
        //         "email",
        //         "password"
        //     )
        //     .leftJoin("users_tasks", "users_tasks.task_id", "=", "tasks.id")
        //     .leftJoin("users", "users_tasks.user_id", "=", "users.id")

        const tasks: TTaskDB[] = await db("tasks")

        const result: TTaskWithUsers[] = []

        for (let task of tasks) {
            const responsibles = []
            const users_tasks: TUserTaskDB[] = await db("users_tasks").where({ task_id: task.id })
            
            for (let user_task of users_tasks) {
                const [ user ]: TUserDB[] = await db("users").where({ id: user_task.user_id })
                responsibles.push(user)
            }

            const newTaskWithUsers: TTaskWithUsers = {
                ...task,
                responsibles
            }

            result.push(newTaskWithUsers)
        }

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})