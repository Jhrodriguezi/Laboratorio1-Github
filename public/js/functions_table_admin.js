function updateRolUser(iduser){
  let inputUser = document.getElementById('user_'+iduser);
  let inputAnalyst = document.getElementById('analyst_'+iduser);
  let text_tipouser = document.getElementById('tipousuario_'+iduser);
  let flag = false, body={};
  if(text_tipouser.textContent=="user" && inputAnalyst.checked){
    flag = true;
    body['idusuario'] = iduser;
    body['newrole'] = 'analyst';
  }else if(text_tipouser.textContent=="analyst" && inputUser.checked){
    flag = true;
    body['idusuario'] = iduser;
    body['newrole'] = 'user';
  }

  if(flag){
    inputUser.disabled = true;
    inputAnalyst.disabled = true;
    axios.post('/update/user/rol', body)
      .then((r) => {
        inputUser.disabled = false;
        inputAnalyst.disabled = false;
        text_tipouser.textContent = body.newrole;
      })
      .catch(e => {console.log("js/functions_table_admin - "+e)});
  }
}