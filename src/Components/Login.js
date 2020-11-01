import React,{ useEffect,useContext, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../css/whatsapp.css';
import {DataContext} from './Context';
import { useHistory } from 'react-router-dom';

export default function Login() {
    var context = useContext(DataContext);
    let history = useHistory();

    useEffect(() => {
        if(context.isLoggedIn) {
            return history.push('/')
        }
    })
    
    return (
        <div className='login_container'>
            <div className='login_form'>
                <Formik 
                initialValues = {{
                    Email : '',
                    Password : '',
                    Con_Password : ''
                }}

                validationSchema = { Yup.object().shape({
                    Email : Yup.string().required('email is required').email('invalid email'),
                    Password : Yup.string().required('password is required'),
                    Con_Password : Yup.string().required('confirm password is required').oneOf([Yup.ref('Password')],'password not matched')
                }) }

                onSubmit = {
                    fields => {
                        delete fields.Con_Password
                        var status = context.userLogin(fields)
                        status.then(res => {
                            if(res.status) {
                                return history.push('/')
                            }
                            else {
                                alert(res.message);
                            }
                        })
                    }
                }

                render = {({error, status, touched}) => {
                    return <div className='form'>
                            <Form>
                                <h2>Login</h2>
                            <div className='form-group'>
                                <Field name='Email' className='form-control' type='text' placeholder='Email' />
                                <div className='text-danger'>{touched.Email && <ErrorMessage name='Email' />}</div>
                            </div>
                            <div className='form-group'>
                                <Field name='Password' className='form-control' type='password' placeholder='Password' />
                                <div className='text-danger'><ErrorMessage name='Password' /></div>
                            </div>
                            <div className='form-group'>
                                <Field name='Con_Password' className='form-control' type='password' placeholder='Confirm Password' />
                                <div className='text-danger'><ErrorMessage name='Con_Password' /></div>
                            </div>
                            <div className='form-group'>
                                <input type='submit' style={{color:'white',background:'#353535'}} className='btn' value='login' />
                            </div>
                            </Form>
                    </div>

                }}
                />
            </div>
        </div>
    )
}
