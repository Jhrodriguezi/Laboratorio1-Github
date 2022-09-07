const general_functions = {
  date_format: (date) => {
    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
  }
}

module.exports = general_functions;