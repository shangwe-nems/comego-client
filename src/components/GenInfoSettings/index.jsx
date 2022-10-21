import { useInputState } from '@mantine/hooks';
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import * as yup from "yup"
import { BsCheck2, BsCheck2Circle, BsClockHistory, BsUnlockFill, BsX, BsXCircle } from 'react-icons/bs';
import { ActionIcon, Avatar, Badge, Box, Button, Center, createStyles, Divider, Grid, Group, Loader, PasswordInput, Progress, Switch, Text, TextInput } from '@mantine/core';
import { FaRegAddressCard, FaRegSave, FaTimes, FaUserCog } from 'react-icons/fa';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification, useNotifications } from '@mantine/notifications';
import { LoadSessions } from '../../hooks/fetchSessions';
import { changePassword, checkPassword, updateUserProfile } from '../../redux/slices/sessions';
import Loading from '../Loader';


function PasswordRequirement({ meets, label }) {
    return (
        <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
            <Center inline>
                {meets ? <BsCheck2 size={22} /> : <BsX size={22} />}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    );
}

  
const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];
  
function getStrength(password) {
    let multiplier = password.length > 5 ? 0 : 1;
  
    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });
  
    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const useStyles = createStyles((theme) => ({
    root: {
      position: 'relative',
    },
  
    input: {
      height: 'auto',
      paddingTop: 18,
    },
  
    label: {
      position: 'absolute',
      pointerEvents: 'none',
      fontSize: theme.fontSizes.xs,
      paddingLeft: theme.spacing.sm,
      paddingTop: theme.spacing.sm / 2,
      zIndex: 1,
    },
}));

const updateUserSchema = yup.object().shape({
    first_name: yup.string().min(2).max(120).optional(),
    last_name: yup.string().min(2).max(120).optional(),
    email: yup.string().email('not a valid email').max(50).optional(),
    phone: yup.string().min(10).max(18).optional(),
    isActive: yup.boolean().optional(),
    isAvailable: yup.boolean().optional()
})

function GenInfoSettings() {
    const { classes } = useStyles();
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);
    const [loadingPwd, setloadingPwd] = useState(false);
    const [isAuth, setIsAuth] = useState('pending');

    const [user, setuser] = useState();
    const userAuth = useSelector(state => state.sessions.authUser) 
    // const userAuthSessions = useSelector(state => state.sessions.authSessions)
    const [loadingSession, sessionList] = LoadSessions()
    const [verifying, setverifying] = useState(false)

    const pwdInputRef = useRef(null);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            first_name :  '', 
            last_name :  '', 
            phone : '', 
            email: '', 
            isActive: false, 
            isAvailable: false
        },
        resolver: yupResolver(updateUserSchema)
    })

    useEffect(() => {
        
        const userLocal = JSON.parse(localStorage.getItem('authUser'))

        setuser(userAuth ? userAuth : userLocal)

        setValue("first_name", userAuth ? userAuth?.first_name : userLocal?.first_name)
        setValue("last_name",  userAuth ? userAuth?.last_name : userLocal?.last_name)
        setValue("phone", userAuth ? userAuth?.phone : userLocal?.phone)
        setValue("email", userAuth ? userAuth?.email : userLocal?.email) 
        setValue("isActive", userAuth ? userAuth?.isActive : userLocal?.isActive)
        setValue("isAvailable", userAuth ? userAuth?.isAvailable : userLocal?.isAvailable)
       
    }, [userAuth, setValue])
    

    const [valuePwd, setValuePwd] = useInputState('');
    const strength = getStrength(valuePwd);
    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(valuePwd)} />
    ));

    const bars = Array(4)
        .fill(0)
        .map((_, index) => (
        <Progress
            styles={{ bar: { transitionDuration: '0ms' } }}
            value={
            valuePwd.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
            }
            color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
            key={index}
            size={4}
        />
        ));

    const notifications = useNotifications()

    function onSubmit(values, e){
        e.preventDefault()
        setloading(true);
        dispatch(updateUserProfile({_id: userAuth?._id, dataToSubmit: values}))
            .then(res => {
                if(res.payload) {
                    showNotification({
                        color: 'green',
                        title: 'Success',
                        message: 'User updated successfully',
                        icon: <BsCheck2 />
                    })
                    setloading(false)
                }

                if(res.error) {
                    showNotification({
                        color: 'red',
                        title: 'Failed',
                        message: 'Error updating user',
                        icon: <FaTimes />
                    })
                    setloading(false)
                }
            })
    }

    const handleValidatePwd = (e) => {
        const data = pwdInputRef.current.value
        setverifying(true)
        setTimeout(async () => {
            const res = await dispatch(checkPassword({ password: data }))
            if(res.payload.success) {
                setIsAuth("success")
            } 

            if(!res.payload.success) {
                setIsAuth('failed')
                setTimeout(() => {
                    setIsAuth('pending')
                }, 1500);
            }
            setverifying(false)
        }, 1000);
    }

    function onChangePwd(values){
        setloadingPwd(true)

        setTimeout(async () => {
            const res = await dispatch(changePassword({ 
                password: values.password, 
                passwordConfirmation: values.passwordConfirmation
            }))
            
            if(res.payload === undefined) {
                notifications.showNotification({
                    color: 'red',
                    title: 'Failed',
                    message: 'Passwords do not match, try again',
                    icon: <BsX size={26} />
                })
            }

            if(res.payload === 'Created') {
                setIsAuth('pending')
                setValuePwd('')
                notifications.showNotification({
                    color: 'green',
                    title: 'Success',
                    message: 'Password Updated successfully',
                    icon: <BsCheck2 size={26} />
                })
            }
            setloadingPwd(false)
        }, 1000);
        
        
    }

    return (<div style={{display:'inline-flex', justifyContent:'space-between', alignItems: 'flex-start'}}>
        <div style={{width: '62%', border: '1px solid #eaeaea', borderRadius: 4, padding: 14, marginRight:2}}>
            <Text color='red'><FaRegAddressCard size={20} style={{marginBottom:-4}} /> Account Information</Text>
            <Divider />
            <Text size='xs' color='dimmed'>You have the ability to update any general information related to your account.</Text>
            <Grid gutter='sm' style={{marginTop: 14}}>
                <Grid.Col span={4} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border:'1px solid #eaeaea', padding: '24px auto', borderRadius: 8}}>
                    <Avatar color='red' size={94} radius='50%'>{user?.first_name[0]}{user?.last_name[0]}</Avatar>
                    <div style={{textAlign: 'center', marginTop:14}}>
                        <Text size='lg'>{user?.first_name.concat(' ', user?.last_name)}</Text>
                        <Text size='sm' color='blue'>{user?.user_role}</Text>
                        <Divider style={{marginBlock: 7}}/>
                        <Text size='xs' color='dimmed'>{user?.email}</Text>
                        <Text size='xs' color='dimmed'>{user?.phone}</Text>
                        <Divider style={{marginBlock: 7}} />
                        <Badge radius='sm' color={user?.isAvailable ? 'green' : 'gray'}>{user?.isAvailable ? 'Available' : 'Unavailable'}</Badge>
                    </div>
                </Grid.Col> 
                <Grid.Col span={8} style={{paddingInline:14}}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='dates' style={{marginTop: -5}}>
                            <TextInput 
                                label="First Name" placeholder="Input users's first name" classNames={classes} style={{width: '49%'}}  
                                key='first_name' {...register('first_name')}
                                onChange={(e) => setValue('first_name', e.target.value, { shouldValidate: true})}
                                error={errors.first_name ? <span id="error">{errors.first_name?.message}</span> : null}
                            />
                            <TextInput 
                                label="Last Name" placeholder="Input users's last name" classNames={classes} style={{width: '49%'}}  
                                key='last_name' {...register('last_name')}
                                onChange={(e) => setValue('last_name', e.target.value, { shouldValidate: true})}
                                error={errors.last_name ? <span id="error">{errors.last_name?.message}</span> : null}
                            />
                        </div>
                        <div className='dates' style={{marginTop: 18}}>
                            <TextInput 
                                label="Email" placeholder="user email" classNames={classes} style={{width: '49%'}} 
                                key='email' {...register('email')}
                                onChange={(e) => setValue('email', e.target.value, { shouldValidate: true})}
                                error={errors.email ? <span id="error">{errors.email?.message}</span> : null}

                            />
                            <TextInput 
                                label="Telephone" placeholder="Telephone" classNames={classes} style={{width: '49%'}} 
                                key='phone' {...register('phone')} 
                                onChange={(e) => setValue('phone', e.target.value, { shouldValidate: false})}
                                error={errors.phone ? <span id="error">{errors.phone?.message}</span> : null}

                            />
                        </div>
                        <div className='dates' style={{marginTop: 24}}>
                            <Switch 
                                size='md'
                                color='red'
                                label="Available for work"
                                onLabel="ON"
                                offLabel="OFF"
                                key='isAvailable' name='isAvailable' inputRef={register}
                                onTouchEnd={(e) => setValue('isAvailable', e.target.value, { shouldValidate: true})}
                            />
                        </div>
                        <div className='dates'>
                            <Switch 
                                size='md'
                                color='blue'
                                label="Enabled account"
                                onLabel="ON"
                                offLabel="OFF"
                                disabled
                                key='isActive' name='isActive' inputRef={register}
                                onChange={(e) => setValue('isActive', e.target.value, { shouldValidate: true})}
                            />
                        </div>
                        <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: -48, }}>
                            <Button loading={loading} leftIcon={<FaRegSave />}  type='submit' color='red' size='sm'>Save update</Button>
                        </div>
                    </form>
                </Grid.Col>
                
            </Grid>
            <Text color='red' weight={400} style={{marginTop: 24}}><FaUserCog size={20} style={{marginBottom:-4}} /> Password Change</Text>
            <Divider />
            <Grid>
                <Grid.Col span={9}>
                    <Text size='xs' color='dimmed' style={{marginBottom: 4}}>You need to make sure that your password is only known by you. Don't share your personnal password with anybody</Text>
                    <form onSubmit={handleSubmit(onChangePwd)}>
                        <div className='dates' style={{width: '100%'}}>
                            <TextInput
                                type='password' 
                                ref={pwdInputRef}
                                variant='filled' 
                                id='current_password'
                                label="Current Password" 
                                style={{width: '49%'}} 
                                required 
                                
                                rightSection={verifying ? <Loader color="red" size="sm" /> :
                                    <ActionIcon color="red" variant="outline" onClick={() => handleValidatePwd()}>
                                        <BsUnlockFill />
                                    </ActionIcon>
                                }
                            />
                            {isAuth === 'success' ? 
                            <Badge radius='sm' color='green' size='xl' style={{width: '49%', marginBottom:2}}>
                                <BsCheck2Circle size={22} style={{marginRight: 4, marginBottom: -6}} /> Verified
                            </Badge> :
                            isAuth === 'failed' ? 
                            <Badge radius='sm' color='red' size='xl' style={{width: '49%', marginBottom:2}}>
                                <BsX size={22} style={{marginRight: 4, marginBottom: -6}} /> Failed
                            </Badge> : null
                            }
                        </div>
                        <div style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between'}}>
                            <div style={{width: '49%'}}>
                                <PasswordInput
                                    value={valuePwd}
                                    key='first_name' {...register('password')}
                                    onChange={(e) => {
                                        setValue('password', e.target.value, { shouldValidate: false})
                                        setValuePwd(e.target.value)
                                    }}
                                    error={errors.password ? <span id="error">{errors.password?.message}</span> : null}
                                    placeholder="Your new password"
                                    label="New Password"
                                    disabled={!(isAuth === 'success')}
                                    required
                                />
                                <Group spacing={5} grow mt="xs" mb="md">
                                    {bars}
                                </Group>

                                <PasswordRequirement label="Has at least 6 characters" meets={valuePwd.length > 5} />
                                {checks}
                            </div>

                            <div style={{width: '49%'}}>
                                <PasswordInput 
                                    variant='filled'
                                    label='Confirm Password'
                                    key='passwordConfirmation' {...register('passwordConfirmation')}
                                    onChange={(e) => setValue('passwordConfirmation', e.target.value, { shouldValidate: false})}
                                    error={errors.first_name ? <span id="error">{errors.first_name?.message}</span> : null}
                                    required
                                    disabled={!(isAuth === 'success')}
                                    defaultValue={valuePwd}
                                />
                            </div>
                        </div>
                        
                        <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: -152}}>
                            <Button disabled={!(isAuth === 'success')} loading={loadingPwd} leftIcon={<FaRegSave />}  type='submit' color='gray' size='sm'>Save</Button>
                        </div>
                    </form>
                </Grid.Col>
            </Grid>
        </div>
        <div style={{border: '1px solid #eaeaea', borderRadius: 4, width:  '37%', padding: 14, marginLeft: 8}}>
            <Text color='red'><BsClockHistory size={16} style={{marginBottom:-2}} /> Session history</Text>
            <Divider />
            <Text size='xs' color='dimmed' style={{marginBottom: 14}}>You can wiew the history of your last logins and the agent you used.  password with anybody</Text>
            {loadingSession ? <div style={{width:'100%', height: '40vh'}}>
                    <Loading />
                </div> : (<div>
                {sessionList.slice(0).reverse().map(session => (
                    <div key={session._id}
                        style={{ width: '100%', marginBlock: 1, display: 'inline-flex', alignItems: 'center', borderBlock: '0.5px solid #eaeaea'}}
                    >
                        <Badge variant='light' radius='sm' color='gray' style={{marginRight: 8}}>
                            {session.createdAt.substring(0, 10).concat(' ', session.createdAt.substring(11,19))}
                        </Badge> 
                        <Text size='xs' color='dimmed'>{session.userAgent.split(')')[0].concat(')')}</Text>
                    </div>
                ))}
            </div>)}
        </div>
    </div>)
}

export default GenInfoSettings