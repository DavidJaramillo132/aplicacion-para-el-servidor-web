// demo-users-crud.mjs
const base = 'http://localhost:3000/users';

async function main() {
  // CREATE
  const created = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombreCompleto: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'secret123',
      rol: 'cliente',
      telefono: '555-1234',
    }),
  }).then((r) => r.json());
  console.log('CREATE ->', created);

  // READ ALL
  const all = await fetch(base).then((r) => r.json());
  console.log('FIND ALL ->', all.length, 'usuarios');

  // READ ONE
  const one = await fetch(`${base}/${created.id}`).then((r) => r.json());
  console.log('FIND ONE ->', one);

  // UPDATE
  const updated = await fetch(`${base}/${created.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefono: '555-9999', rol: 'adminNegocio' }),
  }).then((r) => r.json());
  console.log('UPDATE ->', updated);

  // DELETE
  const removed = await fetch(`${base}/${created.id}`, {
    method: 'DELETE',
  }).then((r) => r.json());
  console.log('DELETE ->', removed);
}

main().catch(console.error);
