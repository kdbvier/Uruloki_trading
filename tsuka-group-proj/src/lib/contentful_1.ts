import { createClient } from 'contentful';
import { IBenifitsItem } from '../@types/generated/contentful.types';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_TOKEN!,
});

export async function getEntries(): Promise<IBenifitsItem[]> {

  const entries = await client.getEntries<IBenifitsItem>({
    content_type: 'benifitsItem', // Replace with your Content Type ID
  });
  console.log(entries);
  // return entries;
  // return entries.items;
  return new Array(3).fill(0);
}

getEntries().then((items) => {
  console.log(items);
}).catch((error) => {
  console.error(error);
});

