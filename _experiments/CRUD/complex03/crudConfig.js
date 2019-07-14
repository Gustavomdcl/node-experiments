import CRUD from './crud';

CRUD.Config(
  'aplicativo_teste_memei_cheirosa','7d',
  'postgres','localhost','postgres','docker','complex03');
CRUD.Server();
CRUD.Migration();
CRUD.Models();
CRUD.Controllers();