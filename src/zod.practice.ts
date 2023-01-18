import { z } from "zod";

const User = z.object({
    name: z.string(),
    age: z.number()
});



