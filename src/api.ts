import { faker } from "@faker-js/faker";

const users = Array.from({ length: 1000 }, () => {
  return { id: crypto.randomUUID(), name: faker.person.fullName() };
});

export async function searchUsers(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filteredUsers = users.filter((user) => user.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

  return filteredUsers.slice(0, 10);
}
