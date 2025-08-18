import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { authEndPoint } from '../../../../constant/Const';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/Context';

function ResetPassword() {
    const {logout}:any|null = useContext(AuthContext);
    const navigate = useNavigate();
    type IFormInput = {
        Email: string;
        OTP: string;
        NewPassword: string;
        ConfirmedNewPassword: string;
    }
    const {register,handleSubmit,formState:{errors},watch}=useForm<IFormInput>({
        defaultValues:{
            Email:'',
            OTP:'',
            NewPassword:'',
            ConfirmedNewPassword:''
        },
        mode:"onSubmit"
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const response = await axios.post(authEndPoint.ResetPassword,data)
            toast.success(response?.data?.message);
            logout(false, () => navigate("/auth/login"));
            
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "حدث خطأ ما");
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
                maxWidth: 400,
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
                    <FontAwesomeIcon icon={faKey} style={{ color: '#fff', fontSize: 28 }} />
                </div>
                <h2 style={{ color: '#018f2c', fontWeight: 900, fontSize: 22, margin: 0 }}>إعادة تعيين كلمة المرور</h2>
                <p style={{ color: '#666', fontSize: 15, textAlign: 'center', margin: '0 0 12px 0' }}>
                    أدخل بريدك الإلكتروني، رمز التحقق، وكلمة المرور الجديدة
                </p>
                <div style={{ width: '100%', marginBottom: 8 }}>
                    <label style={{ color: '#555', fontWeight: 600, marginBottom: 6, display: 'block' }}>البريد الإلكتروني</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="email"
                            aria-label="email"
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
                            {...register("Email",{
                                required:"البريد الإلكتروني مطلوب",
                                pattern:{
                                    value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message:"البريد الإلكتروني غير صالح"
                                }
                            })}
                        />
                        <FontAwesomeIcon icon={faEnvelope} style={{ position: 'absolute', right: 12, top: 13, color: '#009247', fontSize: 18 }} />
                    </div>
                    {errors.Email && <div style={{ color: '#e74c3c', marginTop: 6, fontSize: 15 }}>{errors.Email.message}</div>}
                </div>
                <div style={{ width: '100%', marginBottom: 8 }}>
                    <label style={{ color: '#555', fontWeight: 600, marginBottom: 6, display: 'block' }}>رمز التحقق (OTP)</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            aria-label="otp"
                            placeholder="رمز التحقق"
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
                            {...register("OTP",{required:"رمز التحقق مطلوب"})}
                        />
                        <FontAwesomeIcon icon={faKey} style={{ position: 'absolute', right: 12, top: 13, color: '#009247', fontSize: 18 }} />
                    </div>
                    {errors.OTP && <div style={{ color: '#e74c3c', marginTop: 6, fontSize: 15 }}>{errors.OTP.message}</div>}
                </div>
                <div style={{ width: '100%', marginBottom: 8 }}>
                    <label style={{ color: '#555', fontWeight: 600, marginBottom: 6, display: 'block' }}>كلمة المرور الجديدة</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            aria-label="new-password"
                            placeholder="كلمة المرور الجديدة"
                            style={{
                                width: '100%',
                                padding: '12px 40px 12px 40px',
                                borderRadius: 10,
                                border: '1.5px solid #e0e0e0',
                                fontSize: 16,
                                outline: 'none',
                                background: '#fafafa',
                                fontWeight: 500
                            }}
                            {...register("NewPassword",{
                                required:"كلمة المرور الجديدة مطلوبة",
                                pattern:{
                                    value:
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                                  message: "يجب أن يكون الرقم السري بصيغة صحيحة",
                                },
                            })}
                        />
                        <span
                            style={{ position: 'absolute', left: 12, top: 13, cursor: 'pointer', color: '#009247', fontSize: 18 }}
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                        <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', right: 12, top: 13, color: '#009247', fontSize: 18 }} />
                    </div>
                    {errors.NewPassword && <div style={{ color: '#e74c3c', marginTop: 6, fontSize: 15 }}>{errors.NewPassword.message}</div>}
                </div>
                <div style={{ width: '100%', marginBottom: 8 }}>
                    <label style={{ color: '#555', fontWeight: 600, marginBottom: 6, display: 'block' }}>تأكيد كلمة المرور الجديدة</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            aria-label="confirm-password"
                            placeholder="تأكيد كلمة المرور الجديدة"
                            style={{
                                width: '100%',
                                padding: '12px 40px 12px 40px',
                                borderRadius: 10,
                                border: '1.5px solid #e0e0e0',
                                fontSize: 16,
                                outline: 'none',
                                background: '#fafafa',
                                fontWeight: 500
                            }}
                            {...register("ConfirmedNewPassword",{
                                required:"تأكيد كلمة المرور الجديدة مطلوبة",
                               
                                validate: (value) =>
                                    value === watch("NewPassword") || "كلمات المرور غير متطابقة",
                            })}
                        />
                        <span
                            style={{ position: 'absolute', left: 12, top: 13, cursor: 'pointer', color: '#009247', fontSize: 18 }}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </span>
                        <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', right: 12, top: 13, color: '#009247', fontSize: 18 }} />
                    </div>
                    {errors.ConfirmedNewPassword && <div style={{ color: '#e74c3c', marginTop: 6, fontSize: 15 }}>{errors.ConfirmedNewPassword.message}</div>}
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
                    type="submit"
                >
                    تغيير كلمة المرور
                </button>
            </div>
            </form>
        </div>
    );
}

export default ResetPassword;