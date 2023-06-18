import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpsertAndGetId = {
    name: string,
    pair_address: string,
    price: number,
    change_24hr: number,
    volume: number,
    market_cap: number,
    address: string,
    short_name: string
}

export async function upsertAndGetId({name, pair_address, price, change_24hr, volume, market_cap, address, short_name}: UpsertAndGetId): Promise<number> {
    console.log(`Upserting ${name}...`)
    const itemExists = await prisma.token_cache.findFirst({
        where: {
            pair_address
        }
    })

    const data = {
        name,
        chain: "ethereum",
        pair_address,
        price,
        change_24hr,
        volume: Math.round(volume),
        market_cap,
        last_updated: new Date(),
        address,
        short_name
    }

    if(itemExists != null) {
        console.log("Updating existing record...")
        await prisma.token_cache.update({
            where: {
                id: itemExists.id
            },
            data
        })
        console.log(`Exists with id ${itemExists.id}}`)
        return itemExists.id
    } else {
        console.log("Inserting new record...")
        try {
            const createdItem = await prisma.token_cache.create({data})
            console.log(`Created with id ${createdItem.id}`)
            return createdItem.id
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}