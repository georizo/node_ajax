$(document).ready(function(){
         
    getData();
     
    //Insert function
    $('.row').on('click','.btnSubmit',function(){
      var username = $('#username').val();
      var name = $('#name').val();
      var surname = $('#surname').val();
      var category = $('#category option:selected').val();
      var email = $('#email').val();

      let item = {
        'username':username,
        'name':name,
        'surname':surname,
        'category':category,
        'email':email 
      }

      const checkType = $('.btnSubmit').val();

      if(checkType==='modify'){
        $.ajax({
          url:'http://localhost:3000/user/update',
          type:'post',
          data:item,
          dataType:'JSON'
         })
         .done(function(response){
          let status = response.status;
          let data = response.data;

          if (status) {
            getData();
            resetForm();
            alert(true,'Επιτυχής τροποποίηση του χρήστη');
          } else {
            alert(false,'Πρόβλημα στην τροποποίηση του χρήστη (' + data.message +')');
          }

         });

      }else {
        $.ajax({
        url:'http://localhost:3000/user/create',
        type:'post',
        dataType:'JSON',
        data: item
      })
      .done(function(response){
        let status = response.status;
        let data = response.data;
        
        if(status){
          getData();
          resetForm();
          alert(true,'Επιτυχής καταχώρηση του χρήστη');
        } else{
          alert(false,'Πρόβλημα στην καταχώρηση του χρήστη (' + data.message +')');
        }
    });
   }
    
    });

    //delete function
        $('#tbody').on('click','.btnDelete',function(){
          let username = $(this).val();

          $.ajax({
            url:'http://localhost:3000/user/delete' + '?' + $.param({"username":username}),
            type:'delete',
            dataType:'JSON'
          })
          .done(function(response){
            let status = response.status;
            let data = response.data;

            if(status){
              getData();
              alert(true,'Επιτυχής διαγραφή του χρήστη');
            } else{
              alert(false,'Πρόβλημα στη διαγραφή του χρήστη (' + data.message + ')');
            }
          });
        });
    

    //update function
    $('#tbody').on('click','.btnUpdate',function(){
        let username = $(this).val();
        
        $.ajax({
          url:'http://localhost:3000/user/findOne' + '?' + $.param({'username':username}),
          type:'get',
          dataType:'JSON'
        })
        .done(function(response){
          let status = response.status;
          let data = response.data;

          if(status){
            $('#username').val(data.username);
            $('#name').val(data.name);
            $('#surname').val(data.surname);
            $('#category').val(data.category);
            $('#email').val(data.email);

            $('#username').prop("disabled",true);
            $('#password').prop("disabled",true);

            $('.btnSubmit').val('modify');
          } else{
            alert(false,'Πρόβλημα στην αναζήτηση του χρήστη (' + data.message + ')');
          }
        })
    })
    });

   //search all function
    function getData(){
        $.ajax({
          url:'http://localhost:3000/user/findAll',
          type:'get',
          dataType:'JSON'
        })
        .done(function(response){
          let status = response.status;
          let data = response.data;
          
          if(status){
            createTbody(data);
          }else{
            //console.log("Problem getData");
            alert(false,"Πρόβλημα στην αναζήτηση των χρηστών");
          }
      })

    }

  function createTbody(data){

      $('#userTable > tbody').empty();

      let len = data.length;
          for(let i=0;i<len;i++){
            let username = data[i].username;
            let name = data[i].name;
            let surname = data[i].surname;
            let category = data[i].category;
            let email = data[i].email;

          let tr_str = "<tr>" +
            "<td>" + username + "</td>" +
            "<td>" + name + "</td>" +
            "<td>" + surname + "</td>" +
            "<td>" + category + "</td>" +
            "<td>" + email + "</td>" +
            "<td>" +
              "<button class='btnUpdate btn btn-primary' value=\'"+username+"\'>Τροποποίηση</button>" + 
              "<button class='btnDelete btn btn-primary' value=\'"+username+"\'>Διαγραφή</button>" +
              "</td>" +
            "</tr>"; 

            
      $('#userTable tbody').append(tr_str);
          }
      }

      function alert(status,message){
        if (status){
          $('.alert').addClass('alert-success');
          $('alert').removeClass('alert-danger');
        } else{
          $('.alert').removeClass('alert-success');
          $('alert').addClass('alert-danger');
        }
         $('.alert').html(message);
      }

      function resetForm(){
        $('#frmUser')[0].reset();

        $('#username').prop('disabled',false);
        $('#password').prop('disabled',false);

        $('.btnSubmit').val('insert');
      }
