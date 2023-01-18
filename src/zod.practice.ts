import { z, ZodError } from "zod";

const User = z.object({
    name: z.string().min(20, { message: "Precisa de no mínimo 20 caracteres" }),
    age: z.number()
});

type iUser = z.infer<typeof User>;

const newUser: iUser = {
    name: "Gabriel Henrique",
    age: 24
};

User.parse(newUser);

console.log(newUser);