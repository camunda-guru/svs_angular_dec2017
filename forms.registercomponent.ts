import {Component} from "@angular/core";
import {FormControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../model/customerModel";
import {Router} from "@angular/router";


@Component({
    templateUrl:'./app/forms/forms.registercomponent.html',
    styleUrls:['./app/forms/forms.registercomponent.css']
})
export  class RegisterComponent
{
   private customer:Customer;
   private registerForm:FormGroup;
   private firstName:FormControl;
   private lastName:FormControl;
   private dob:FormControl;
   private email:FormControl;
   private password:FormControl;
   private confirmPassword:FormControl;

   constructor(private formBuilder:FormBuilder,private router:Router)
   {

       this.firstName=new FormControl('',[Validators.minLength(5),
         Validators.maxLength(25),Validators.required, Validators.pattern('[A-Za-z]{5,25}')]);

       this.lastName=new FormControl('',[Validators.minLength(5),
           Validators.maxLength(25),Validators.required,Validators.pattern('[A-Za-z]{5,25}')]);
       this.dob=new FormControl('',[Validators.required]);
       this.email=new FormControl('',[Validators.required]);
       this.password=new FormControl('',[Validators.required]);

       this.confirmPassword=new FormControl('',[Validators.required ]);


       this.registerForm=formBuilder.group({
           firstName:this.firstName,
           lastName:this.lastName,
           dob:this.dob,
           email:this.email,
          password:this.password,
          confirmPassword:this.confirmPassword,

       })
   }

   save():void
   {
      console.log(this.registerForm.value);
      this.customer=this.registerForm.value;
       this.router.navigate(["/login"]);
   }




}