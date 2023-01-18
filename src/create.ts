import { connect, model, Schema } from "mongoose";
import { z } from "zod";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const ZodUserSchema = z.object({
    name: z.string().min(20, { message: "O nome precisa de no mínimo 20 caracteres" }),
    age: z.number().min(10, { message: "O número precisa ser maior que 10" })
});

type UserType = z.infer<typeof ZodUserSchema>;

interface iUser {
    name: string,
    age: number,
}

const NewUserSchema = new Schema<iUser>({
    name: {type: String, required: true},
    age: {type: Number, required: true}
});

const UserModel = model("ZodTeste", NewUserSchema);

async function MongoConnect() {
    try {
        connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvthnwq.mongodb.net/?retryWrites=true&w=majority`);

        app.listen(2707, () => {
            console.log("Connected to database");
        });
    } catch(err) {
        console.log({database_connect_error: err});
    }
}

MongoConnect();

app.get("/", async(req: express.Request, res: express.Response) => {
    try {
        const Allusers = await UserModel.find();

        return res.status(200).json(Allusers);
    } catch(err) {
        console.log({request_all_users_error: err});
        return res.status(500).json({message: "500 - Internal Server Error"});
    }
});

app.post("/register", async(req: express.Request, res: express.Response) => {
    const { name, age }: UserType = req.body;

    const newUser = {
        name,
        age
    }

    ZodUserSchema.parse(newUser);

    if(!newUser) {
        return res.status(400).json(ZodUserSchema);
    }

    try {
        await UserModel.create(newUser);

        return res.status(201).json({message: "Usuário criado com sucesso!"});
    } catch(err) {
        console.log({register_new_user_error: err});
        return res.status(500).json({message: "500 - Internal Server Error"});
    }
});

export default app;