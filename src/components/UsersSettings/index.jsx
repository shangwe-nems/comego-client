import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Grid, Modal, Title, ScrollArea, TextInput, Table, ActionIcon, createStyles, UnstyledButton, Group, Text, Divider, Avatar, Badge, Switch } from '@mantine/core'
import { BsFolderPlus, BsPersonPlus, BsSearch, BsPencilSquare, BsTrash, BsCheck2, BsX, BsXOctagonFill } from 'react-icons/bs'
import { useModals } from '@mantine/modals'
import UserForm from '../UserForm'
import { FaUserCog } from 'react-icons/fa'
import { LoadUsers } from '../../hooks/fetchUsers'
import Loading from '../Loader'
import { deleteUser, updateUser } from '../../redux/slices/users'
import { showNotification, useNotifications } from '@mantine/notifications'


const useStyles = createStyles((theme) => ({
    th: {
      padding: '0 !important',
    },
  
    control: {
      width: '100%',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    },
  
    icon: {
      width: 21,
      height: 21,
      borderRadius: 21,
    },
}));

function Th({ children, onSort }) {
    const { classes } = useStyles();
    return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
            {children === '-' ? null : 
            <Text weight={500} size="sm">
              {children}
            </Text>
            }
          </Group>
        </UnstyledButton>
      </th>
    );
}

function filterData(data, search) {
    const keys = ['first_name', 'last_name', 'user_role', 'email', 'phone']
    const query = search.toLowerCase().trim();
    return data.filter(
        (item) => keys.some(
            (key) => item[key].toLowerCase().includes(query)
        ));
}
  

function UsersSettings() {
    const usersState = useSelector(state => state.users)
    const [search, setSearch] = useState('');
    const dispatch = useDispatch()
    const notifications = useNotifications()
    
    const [isLoading, users] = LoadUsers();

    const [createVisible, setcreateVisible] = useState(false)
    const [editVisible, seteditVisible] = useState(false)
    const [filtegreenData, setfiltegreenData] = useState(users || [])
    const [selectedUser, setselectedUser] = useState()

    useEffect(() => { 
        setfiltegreenData(usersState)
        return () => {
            setfiltegreenData([])
        }
    }, [usersState, users])
    
    const modals = useModals();

    const openConfirmModal = (e, data) => modals.openConfirmModal({
        title: <Text size='lg' weight={400} color="green" style={{display: 'inline-flex', alignItems: 'center'}}>Delete this record ?</Text>,
        children: (
        <Text size="xs">
            Do you really want to delete this agent ? Please confirm
        </Text>
        ),
        zIndex: 201,
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        confirmProps: {color: 'green', size: 'xs', leftIcon: <BsTrash size={16} />},
        cancelProps : {size: 'xs'},
        onCancel: () => console.log('Cancel'),
        onConfirm: async () => {
            const res = await dispatch(deleteUser(data._id))
            if(res.payload?._id) {
                showNotification({
                    color: 'green',
                    title: 'Success',
                    message: 'User deleted successfully',
                    icon: <BsCheck2 />
                })
            } 

            if(res.error.message === "Forbidden") {
                showNotification({
                    color: 'green',
                    title: 'Forbidden',
                    message: 'You are not authorized to perfom this action!!',
                    icon: <BsXOctagonFill />
                })
            }
      
            if(res.error.message !== "Forbidden") {
      
                showNotification({
                    color: 'green',
                    title: 'Error',
                    message: res.error.message,
                    icon: <BsX />
                })
            }
            
        },
    })   

    // Here is where we design the data in the rows data
    const rows = filtegreenData?.slice(0).reverse().map((row) => (
        <tr key={row._id} style={{cursor: "pointer"}}>
            {/* avatar */}
            <td>
                <Avatar color='gray'><FaUserCog size={20} /></Avatar>
            </td>

            {/* Names & skills */}
            <td>
                <h3 style={{margin: 0, padding: 0}}>{(row?.first_name)?.concat(' ', row?.last_name)}</h3>
                <p style={{textOverflow: 'ellipsis', color: 'red', overflow: 'hidden', fontSize: 12}}>{row.user_role}</p>
            </td>
            {/* contacts */}
            <td style={{textAlign: 'left'}}>
                <h3 style={{margin: 0, padding: 0}}>{row.phone}</h3>
                <p style={{textOverflow: 'ellipsis', color: 'GrayText', overflow: 'hidden', fontSize: 12}}>{row.email}</p>
            </td>
            {/* joining & status */}
            <td style={{textAlign: 'left'}}>
                <h3 style={{margin: 0, padding: 0}}>{row.createdAt.substring(0, 10).concat(' ', row.createdAt.substring(11,19))}</h3>
                <Badge 
                    variant='outline'
                    radius='sm' 
                    size='xs' 
                    color={row.isAvailable ? 'red' : 'gray'}
                >
                    {row.isAvailable ? 'available' : 'unavailable'}
                </Badge>
            </td>
            {/* exit & reason */}
            <td style={{textAlign: 'left'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, color: 'dodgerblue'}}>{row.last_session.createdAt ? row.last_session?.createdAt.substring(0, 10).concat(' ', row.last_session?.createdAt.substring(11,19)) : 'N/A'}</h3>
                <p style={{textOverflow: 'ellipsis', color: 'GrayText', overflow: 'hidden', fontSize: 12}}>{row.last_session.createdAt ? row.last_session?.userAgent.split(')')[0].concat(')') : 'N/A'}</p>
            </td>
            {/* Events covegreen */}
            <td>
                <Switch size='md' color='red' onLabel='ON' offLabel='OFF' defaultChecked={row.isActive ? true : false} onChange={(e) => handleDisable(e, row)} />
            </td>
            <td>
                <span style={{display: 'inline-flex', alignItems: 'center'}}>
                <ActionIcon color="teal" variant="light" style={{marginRight: 14}} onClick={() => { seteditVisible(true); setselectedUser(row)}}><BsPencilSquare size={16} /></ActionIcon>
                <ActionIcon color="red" variant="light" onClick={(e) => {openConfirmModal(e, row)}} ><BsTrash size={16} /></ActionIcon>
                </span>
          </td>
        </tr>
    ));

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setfiltegreenData(filterData(users, value));
    };

    const handleDisable = (e, data) => {
        dispatch(updateUser({ _id: data?._id, dataToSubmit: { isActive: !data?.isActive }}))
            .then(res => {
                if(res.payload) {
                    notifications.showNotification({
                        color: 'green',
                        title: 'Success',
                        message: `User ${res.payload.isActive ? 'Enabled' : 'disabled'} successfully`,
                        icon: <BsCheck2 />
                    })
                }

                if(res.error) {
                    notifications.showNotification({
                        color: 'green',
                        title: 'Error',
                        message: 'Disabling user failed...',
                        icon: <BsX />
                    })
                }
            })
    }
    
    return (
        <div style={{border: '1px solid #eaeaea', borderRadius: 4, padding: -14}}>
            <Grid style={{marginBottom:7}}>
                <Grid.Col span={12}>
                    <Card>
                        <div>
                            <ScrollArea>
                                <div style={{width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Button leftIcon={<BsPersonPlus size={20} />} onClick={() => setcreateVisible(true)} color="red" style={{marginRight: 14}}>Nouvel utilisateur</Button>
                                    <TextInput
                                        placeholder="Search by any field"
                                        variant="filled" 
                                        icon={<BsSearch size={14} />}
                                        value={search}
                                        onChange={handleSearchChange}
                                        style={{width: 400}}
                                    />
                                </div>
                                <Divider style={{marginBlock:14}} />
                                
                                <Table 
                                    highlightOnHover
                                    horizontalSpacing="md"
                                    verticalSpacing="xs"
                                    sx={{ tableLayout: 'fixed', minWidth: 700 }}
                                >
                                    <colgroup>
                                        <col span="1" style={{width: "4.6%"}} />
                                        <col span="1" style={{width: "16%"}} />
                                        <col span="1" style={{width: "16%"}} />
                                        <col span="1" style={{width: "12%"}} />
                                        <col span="1" style={{width: "14%"}} />
                                        <col span="1" style={{width: "12%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <Th>-</Th>
                                            <Th>
                                                Names & role
                                            </Th>
                                            <Th>
                                                Contacts
                                            </Th>
                                            <Th>
                                                Joined & status
                                            </Th>
                                            <Th>
                                                Last loggedin
                                            </Th>
                                            <Th>
                                                Enabled account
                                            </Th>
                                            <Th>
                                                Actions
                                            </Th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan={7} style={{height: 120}}>
                                                <Loading />
                                            </td>
                                        </tr>
                                    </tbody>) : (<tbody>
                                    {rows.length > 0 ? (
                                        rows
                                    ) : (
                                        <tr >
                                            <td colSpan={7}>
                                                <Text weight={500} align="center">
                                                    Nothing found
                                                </Text>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>)}
                                </Table>
                            </ScrollArea>
                        </div>
                    </Card>
                </Grid.Col>
            </Grid>

            <Modal
                overlayOpacity={0.5}
                opened={createVisible}
                onClose={() => setcreateVisible(false)}
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#40c057'}}><BsFolderPlus size={18} style={{marginRight:8}} /> New user</Title>}
            >
                <UserForm 
                    status='create' 
                    handleClose={() => {
                        setcreateVisible(false)
                        setselectedUser(undefined)
                    }} 
                />
            </Modal>

            <Modal
                overlayOpacity={0.5}
                opened={editVisible}
                onClose={() => seteditVisible(false)}
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#40c057'}}><BsPencilSquare size={18} style={{marginRight:8}} /> Edit user</Title>}
            >
                <UserForm 
                    status='edit' 
                    handleClose={() => {
                        seteditVisible(false)
                        setselectedUser(undefined)
                    }} 
                    user={selectedUser}  />
            </Modal>
    </div>
    )
}

export default UsersSettings