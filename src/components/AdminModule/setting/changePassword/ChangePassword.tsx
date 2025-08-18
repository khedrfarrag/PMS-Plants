import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { authEndPoint } from '../../../../constant/Const';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ChangePassword() {
    const navigate = useNavigate();
    type IFormInput = {
        Email: string;
      };
const {handleSubmit,register,formState:{errors}}=useForm<IFormInput>({
    defaultValues:{
        Email:''
    },
    mode:"onSubmit"
})
const onSubmit: SubmitHandler<IFormInput> =async (data) => {
    try {
        const response = await axios.post(authEndPoint.ForgotPassword,data)
        toast.success(response.data.message);
        navigate("/admin/reset-password");
    } catch (error) {
        toast.error(error.response.data.message);
    }
}
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f6f6f6',
            padding: '24px'
        }}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 4px 24px rgba(1,143,44,0.10)',
                padding: '36px 28px',
                maxWidth: 380,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18
            }}>
                <div style={{
                    background: '#009247',
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                }}>
                    <FontAwesomeIcon icon={faLock} style={{ color: '#fff', fontSize: 28 }} />
                </div>
                <h2 style={{ color: '#018f2c', fontWeight: 900, fontSize: 22, margin: 0 }}>تغيير كلمة المرور</h2>
                <p style={{ color: '#666', fontSize: 15, textAlign: 'center', margin: '0 0 12px 0' }}>
                    أدخل بريدك الإلكتروني لإرسال رمز تحقق لإعادة تعيين كلمة المرور
                </p>
                <div style={{ width: '100%', marginBottom: 8 }}>
                    <label style={{ color: '#555', fontWeight: 600, marginBottom: 6, display: 'block' }}>البريد الإلكتروني</label>
                    <div style={{ position: 'relative' }}>

                        <input
                            type="email"
                            aria-label='email'
                            placeholder="example@email.com"
                            style={{
                                width: '100%',
                                padding: '12px 40px 12px 12px',
                                borderRadius: 10,
                                border: '1.5px solid #e0e0e0',
                                fontSize: 16,
                                outline: 'none',
                                background: '#fafafa',
                                fontWeight: 500
                            }}
                            {...register("Email",{required:"البريد الإلكتروني مطلوب",
                                pattern:{
                                    value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message:"البريد الإلكتروني غير صالح"
                                }
                            })}
                        />
                        <FontAwesomeIcon icon={faEnvelope} style={{ position: 'absolute', right: 12, top: 13, color: '#009247', fontSize: 18 }} />

                    </div>
                </div>
                <button
                    style={{
                        width: '100%',
                        background: '#009247',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '12px',
                        fontWeight: 700,
                        fontSize: 17,
                        cursor: 'pointer',
                        marginTop: 8,
                        boxShadow: '0 2px 8px rgba(1,143,44,0.08)',
                        transition: 'background 0.2s',
                    }}
                    // onClick={...}  // سيتم ربطها لاحقاً
                    type='submit'
                    >
                    إرسال
                </button>
                {errors.Email && <div style={{ color: '#e74c3c', marginTop: 10, fontSize: 15 }}>{errors.Email.message}</div>}
            </div>
            </form>

        </div>
    );
}

export default ChangePassword;