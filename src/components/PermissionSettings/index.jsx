import React, { forwardRef, useState } from 'react'
import { Button, Card, Grid, Select, Title, Table, createStyles, UnstyledButton, Group, Text, Divider, Avatar, Switch, Checkbox } from '@mantine/core'
import { BsSearch, BsShieldExclamation, BsEye, BsFileCheck, BsCheck, BsExclamationTriangle, BsXOctagonFill } from 'react-icons/bs'

import { FaRegSave } from 'react-icons/fa'
import { LoadUsers } from '../../hooks/fetchUsers'
import { changeUserPermissions } from '../../redux/slices/users'
import { useDispatch } from 'react-redux';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';

const data = [
    {
        _id: "dsd-0001",
        label: "Approvisionnements des produits.",
        create : 'CREATE_PURCHASE',
        read: 'READ_PURCHASE',
        update: 'UPDATE_PURCHASE',
        delete: 'DELETE_PURCHASE'
    },
    {
        _id: "dsd-0002",
        label: "Clients reguliers.",
        create : 'CREATE_CLIENT',
        read: 'READ_CLIENT',
        update: 'UPDATE_CLIENT',
        delete: 'DELETE_CLIENT'
    },
    {
        _id: "dsd-0003",
        label: "Utilisateurs du systeme",
        create : 'CREATE_USER',
        read: 'READ_USER',
        update: 'UPDATE_USER',
        delete: 'DELETE_USER'
    },
    {
        _id: "dsd-0012",
        label: "Permissions dans le systeme.",
        create : 'CREATE_PERMISSIONS',
        read: 'READ_PERMISSIONS',
        update: 'UPDATE_PERMISSIONS',
        delete: 'DELETE_PERMISSIONS'
    },
    {
        _id: "dsd-0004",
        label: "Les factures de chaque vente. ",
        create : 'CREATE_INVOICE',
        read: 'READ_INVOICE',
        update: 'UPDATE_INVOICE',
        delete: 'DELETE_INVOICE'
    },
    {
        _id: "dsd-0005",
        label: "Les transactions financieres. ",
        create : 'CREATE_FINANCE',
        read: 'READ_FINANCE',
        update: 'UPDATE_FINANCE',
        delete: 'DELETE_FINANCE'
    },
    {
        _id: "dsd-0006",
        label: "Les ventes des produits. ",
        create : 'CREATE_SALE',
        read: 'READ_SALE',
        update: 'UPDATE_SALE',
        delete: 'DELETE_SALE'
    },
    {
        _id: "dsd-0007",
        label: "Les produits dans le stock.",
        create : 'CREATE_STOCK',
        read: 'READ_STOCK',
        update: 'UPDATE_STOCK',
        delete: 'DELETE_STOCK'
    },
    {
        _id: "dsd-00014",
        label: "Les voyages pour les approvisionnements",
        create : 'CREATE_TRAVEL',
        read: 'READ_TRAVEL',
        update: 'UPDATE_TRAVEL',
        delete: 'DELETE_TRAVEL'
    },
    {
        _id: "dsd-0008",
        label: "Les fournisseurs des produits",
        create : 'CREATE_PROVIDER',
        read: 'READ_PROVIDER',
        update: 'UPDATE_PROVIDER',
        delete: 'DELETE_PROVIDER'
    },
    {
        _id: "dsd-0009",
        label: "Les libellés des transactions. ",
        create : 'CREATE_DESIGNATION',
        read: 'READ_DESIGNATION',
        update: 'UPDATE_DESIGNATION',
        delete: 'DELETE_DESIGNATION'
    }
]


const dataList = [
    {   
        label : "Vous pouvez consulter le tableau de bord et toutes les données qui y sont affichées sans aucune restriction.",
        id: "VIEW_DASHBOARD", 
        description: "Le tableau de bord est une représentation visuelle de toutes vos données. Son objectif premier est de fournir des informations en un coup d'œil."
    },
    {
        label : "Vous pouvez visualiser la chaîne d'approvisionnement avec les détails concernant les différents produits et les fournisseurs enregistrés.", 
        id: "VIEW_PURCHASES", 
        description: "La section des approvisionnements est l'endroit où vous pouvez trouver les informations de tous les produits fournis, et le coût de leur acquisition, de plus, vous avez la possibilité d'ajouter un nouveau produit ainsi que ceux existants."
    },
    {   
        label : "Vous pouvez consulter l'état du stock et les differents prix y afférentes.", 
        id: "VIEW_STOCKS", 
        description: 'La section stock vous permet de visualiser les differents produits en stock avec leur quantité, mais aussi ajouter les prix moyens et géneraux aux nouveaux produits.'
    },
    {
        label : "Vous pouvez initier une vente mais aussi visualiser les différentes ventes effectuées.", 
        id: "VIEW_SALES", 
        description: "La section vente vous permet d'effectuer des ventes, des visualiser les ventes effectuées mais aussi annuler les factures associées. "
    },
    {
        label : "Vous pouvez consulter les états financiers et les transactions financières.", 
        id: "VIEW_FINANCES", 
        description: "La section finance vous permet d'éffectuer des mouvements financiers dans la caisse autant que dans la banque."
    },
    {
        label : "Vous pouvez consulter la liste de tous les clients enregistrés.", 
        id: "VIEW_CLIENTS", 
        description: "La section client vous permet de visualiser tous les clients ainsi que les différentes créances qu'ils peuvent avoir envers nous."
    },
    {
        label : "Vous pouvez retrouver les resultats financiers de chaque libellé.", 
        id: "VIEW_REPORTS", 
        description: 'La section resultat vous permet de visualiser les résultats financiers sur une periode donnée.'
    },
    {
        label : "Vous pouvez consulter l'historique de tous les voyages effectués.", 
        id: "VIEW_TRIPS", 
        description: 'La section voyage vous permet de visualiser tous les voyages effectués avec leurs différentes informations.'
    },
    {
        label : "Vous pouvez visualiser les informations des differents fournisseurs des produits.", 
        id: "VIEW_PROVIDERS", 
        description: "La section fournisseur vous permet de visualiser tous vos fournisseurs ainsi qu'effectuer des remboursements directement dans la caisse."
    },
    {
        label : "Vous pouvez accéder aux differents paramètres des utilisateurs et leurs permissions.", 
        id: "VIEW_USERS", 
        description: "La section utilisateurs et autorisations permet de créer de nouveaux utilisateurs et de leur attribuer des autorisations et un rôle. Cette section ne doit être accessible à personne d'autre que le superutilisateur ou l'administrateur."
    },
]

const SelectUser = forwardRef(({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
        <Group noWrap>
            <Avatar src={image} />
            <div style={{ width: "100%"}}>
                <Text size="sm" weight={500}>{label}</Text>
                <Text size="xs" weight={400} color="dimmed">
                    {description}
                </Text>
            </div>
        </Group>
    </div>
    )
);

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

function Th({ children, reversed, sorted, onSort }) {
    const { classes } = useStyles();
    return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="center">
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


function PermissionSettings() {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);

    const [selectedUser, setselectedUser] = useState(null)

    const [isLoading, users] = LoadUsers();

    const form = useForm({
        initialValues: {
            // View permissions
            VIEW_DASHBOARD: false,
            VIEW_PURCHASE: false,
            VIEW_STOCKS: false,
            VIEW_SALES: false,
            VIEW_FINANCES: false,
            VIEW_REPORTS: false,
            VIEW_CLIENTS: false,
            VIEW_TRIPS: false,
            VIEW_PROVIDERS: false,
            VIEW_USERS: false,


            // User related permissions
            CREATE_USER: false,
            READ_USER: false,
            UPDATE_USER: false,
            DELETE_USER: false,
            UPDATE_PERMISSIONS: false,
            READ_PERMISSIONS: false,

            // Client related permissions
            CREATE_CLIENT: false,
            READ_CLIENT: false,
            UPDATE_CLIENT: false,
            DELETE_CLIENT: false,

            // Designation related permissions
            CREATE_DESIGNATION: false,
            READ_DESIGNATION: false,
            UPDATE_DESIGNATION: false,
            DELETE_DESIGNATION: false,

            // Finance related permissions
            CREATE_FINANCE: false,
            READ_FINANCE: false,
            UPDATE_FINANCE: false,
            DELETE_FINANCE: false,


            // Invoice related permissions
            CREATE_INVOICE: false,
            READ_INVOICE: false,
            UPDATE_INVOICE: false,
            DELETE_INVOICE: false,

            // Provider related permissions
            CREATE_PROVIDER: false,
            READ_PROVIDER: false,
            UPDATE_PROVIDER: false,
            DELETE_PROVIDER: false,

            // Purchase related permissions
            CREATE_PURCHASE: false,
            READ_PURCHASE: false,
            UPDATE_PURCHASE: false,
            DELETE_PURCHASE: false,

            // Sale related permissions
            CREATE_SALE: false,
            READ_SALE: false,
            UPDATE_SALE: false,
            DELETE_SALE: false,

            // Stock related permissions
            CREATE_STOCK: false,
            READ_STOCK: false,
            UPDATE_STOCK: false,
            DELETE_STOCK: false,

            // Travel related permissions
            CREATE_TRAVEL: false,
            READ_TRAVEL: false,
            UPDATE_TRAVEL: false,
            DELETE_TRAVEL: false,

            // Reports related permissions
            READ_FINANCES: false
        },
    })

    
    const optionsUsers = users && users.map(user => {
        return {
            label : user.first_name.concat(' ', user.last_name), 
            value: user._id, 
            description: user.user_role
        }
    })
    
    const handleChange = (event) => {
        const user = users.find(o => o._id === event)
        setselectedUser(user)

        const data = user?.permissions

        form.setValues({
            // View permissions
            VIEW_DASHBOARD: data?.VIEW_DASHBOARD,
            VIEW_PURCHASE: data?.VIEW_PURCHASE,
            VIEW_STOCKS: data?.VIEW_STOCKS,
            VIEW_SALES: data?.VIEW_SALES,
            VIEW_FINANCES: data?.VIEW_FINANCES,
            VIEW_REPORTS: data?.VIEW_REPORTS,
            VIEW_CLIENTS: data?.VIEW_CLIENTS,
            VIEW_TRIPS: data?.VIEW_TRIPS,
            VIEW_PROVIDERS: data?.VIEW_PROVIDERS,
            VIEW_USERS: data?.VIEW_USERS,


            // User related permissions
            CREATE_USER: data?.CREATE_USER,
            READ_USER: data?.READ_USER,
            UPDATE_USER: data?.UPDATE_USER,
            DELETE_USER: data?.DELETE_USER,
            UPDATE_PERMISSIONS: data?.UPDATE_PERMISSIONS,
            READ_PERMISSIONS: data?.READ_PERMISSIONS,

            // Client related permissions
            CREATE_CLIENT: data?.CREATE_CLIENT,
            READ_CLIENT: data?.READ_CLIENT,
            UPDATE_CLIENT: data?.UPDATE_CLIENT,
            DELETE_CLIENT: data?.DELETE_CLIENT,

            // Designation related permissions
            CREATE_DESIGNATION: data?.CREATE_DESIGNATION,
            READ_DESIGNATION: data?.READ_DESIGNATION,
            UPDATE_DESIGNATION: data?.UPDATE_DESIGNATION,
            DELETE_DESIGNATION: data?.DELETE_DESIGNATION,

            // Finance related permissions
            CREATE_FINANCE: data?.CREATE_FINANCE,
            READ_FINANCE: data?.READ_FINANCE,
            UPDATE_FINANCE: data?.UPDATE_FINANCE,
            DELETE_FINANCE: data?.DELETE_FINANCE,


            // Invoice related permissions
            CREATE_INVOICE: data?.CREATE_INVOICE,
            READ_INVOICE: data?.READ_INVOICE,
            UPDATE_INVOICE: data?.UPDATE_INVOICE,
            DELETE_INVOICE: data?.DELETE_INVOICE,

            // Provider related permissions
            CREATE_PROVIDER: data?.CREATE_PROVIDER,
            READ_PROVIDER: data?.READ_PROVIDER,
            UPDATE_PROVIDER: data?.UPDATE_PROVIDER,
            DELETE_PROVIDER: data?.DELETE_PROVIDER,

            // Purchase related permissions
            CREATE_PURCHASE: data?.CREATE_PURCHASE,
            READ_PURCHASE: data?.READ_PURCHASE,
            UPDATE_PURCHASE: data?.UPDATE_PURCHASE,
            DELETE_PURCHASE: data?.DELETE_PURCHASE,

            // Sale related permissions
            CREATE_SALE: data?.CREATE_SALE,
            READ_SALE: data?.READ_SALE,
            UPDATE_SALE: data?.UPDATE_SALE,
            DELETE_SALE: data?.DELETE_SALE,

            // Stock related permissions
            CREATE_STOCK: data?.CREATE_STOCK,
            READ_STOCK: data?.READ_STOCK,
            UPDATE_STOCK: data?.UPDATE_STOCK,
            DELETE_STOCK: data?.DELETE_STOCK,

            // Travel related permissions
            CREATE_TRAVEL: data?.CREATE_TRAVEL,
            READ_TRAVEL: data?.READ_TRAVEL,
            UPDATE_TRAVEL: data?.UPDATE_TRAVEL,
            DELETE_TRAVEL: data?.DELETE_TRAVEL,

            // Reports related permissions
            READ_FINANCES: data?.READ_FINANCES
        })
    };

    function handleSubmit(values, e){
        e.preventDefault()
        setloading(true);  
    
        dispatch(changeUserPermissions({ _id: selectedUser?._id, dataToSubmit: {  ...values }}))
            .then(res => {
                if(res.payload) {
                    showNotification({
                        color: 'green',
                        title: 'Success',
                        message: 'Permission saved successfully',
                        icon: <BsCheck />
                    })
                    setloading(false)
                }

                if(res.error.message === "Forbidden") {
                    setloading(false)
                    showNotification({
                        color: 'red',
                        title: 'Forbidden',
                        message: 'You are not authorized to perfom this action!!',
                        icon: <BsXOctagonFill />
                    })
                }
          
                if(res.error.message !== "Forbidden") {
                    setloading(false)
                    showNotification({
                        color: 'red',
                        title: 'Error',
                        message: res.error.message,
                        icon: <BsExclamationTriangle />
                    })
                }
            })
        
    }
    
    

    // Here is where we design the data in the rows data
    const rows = data.map((row) => (
        <tr key={row?._id} style={{cursor: "pointer"}}>
            {/* Data Collection */}
            <td>
                <Text style={{textOverflow: 'ellipsis', overflow: 'hidden'}} size='sm' ><BsFileCheck size={18} style={{marginBottom: -3}} /> {row.label}</Text>
            </td>
            {/* READ */}
            <td>
                <span style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Checkbox 
                        color='red' size='sm' 
                        // defaultChecked={row.read ? true : false} 
                        {...form.getInputProps(`${row?.read}`, { type: 'checkbox' })}
                    />
                </span>
            </td>

            {/* CREATE */}
            <td>
                <span style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Checkbox 
                        color='red' size='sm' 
                        // defaultChecked={row.create ? true : false} 
                        disabled={['dsd-0011', 'dsd-0012'].includes(row._id)}
                        {...form.getInputProps(`${row?.create}`, { type: 'checkbox' })}
                    />
                </span>
            </td>


            {/* UPDATE */}
            <td>
                <span style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Checkbox 
                        color='red' size='sm' 
                        // defaultChecked={row.update ? true : false} 
                        disabled={['dsd-0011'].includes(row._id)} 
                        {...form.getInputProps(`${row?.update}`, { type: 'checkbox' })}
                    />
                </span>
            </td>

            {/* DELETE */}
            <td>
                <span style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Checkbox 
                        color='red' size='sm' 
                        // defaultChecked={row.delete ? true : false} 
                        disabled={['dsd-0010', 'dsd-0012', 'dsd-0011'].includes(row._id)}
                        {...form.getInputProps(`${row?.delete}`, { type: 'checkbox' })}
                    />
                </span>
            </td>
        </tr>
    ));

    const rowsui = dataList.map(row => (
        <div key={row?.id} style={{width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: 14, borderBottom: '1px solid #eaeaea'}}>
            <div style={{width: '80%'}}>
                <Text size='sm' weight={600} >{row.label}</Text>
                <Text size='xs' color='dimmed'>{row.description}</Text>
            </div>
            
            <Switch 
                color='red' onLabel='ON' offLabel='OFF' size='lg'  
                // defaultChecked={row.allowed ? true : false } 
                {...form.getInputProps(`${row?.id}`, { type: 'checkbox' })}
            />
        </div>
    ))
    
    return (
        <div style={{border: '1px solid #eaeaea', borderRadius: 4, padding: -14}}>
            <Grid gutter='sm' style={{marginBottom:7}}>
                <Grid.Col span={12}>
                    <Card>
                        <div style={{width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14}}>
                            <Select 
                                searchable clearable data={optionsUsers} 
                                itemComponent={SelectUser} placeholder="Select user"  
                                onChange={handleChange} variant="filled" 
                                style={{width: 300}} icon={<BsSearch size={14} />} 
                            />
                            <div> 
                            {!selectedUser || selectedUser === null ? null :
                                <div style={{display: 'inline-flex', alignItems: 'center'}}>
                                    <div style={{marginRight: 14, textAlign: 'right'}}>
                                        <Text weight={600}>{selectedUser?.first_name.concat(' ', selectedUser?.last_name)}</Text>
                                        <Text size='xs' color='blue'>{selectedUser?.user_role}</Text>
                                    </div>
                                    <Avatar size={42}/>
                                </div>
                            }
                            </div>
                        </div>
                        <Divider />
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Title order={3}  style={{marginTop: 14, fontWeight: 600}}><BsEye style={{marginBottom: -3}} /> Permissions rélatives à l'affichage</Title>
                            <Text size='sm' >Cette section vous permet, en tant que super-utilisateur, de choisir les pages que l'utilisateur peut ou ne peut pas voir, car elle permet une plus grande confidentialité. </Text>
                            
                            <div style={{width: '100%', marginTop: 14}}>
                                {rowsui}
                            </div>

                            <Title order={3} style={{marginTop: 28, fontWeight: 600}}><BsShieldExclamation style={{marginBottom: -3}} /> Permissions rélatives aux actions à effectuer.</Title>
                            <Text size='sm'>En fonction du rôle que vous attribuez à chaque utilisateur dans ce système, cette section vous permet de choisir les actions que l'utilisateur sélectionné peut ou ne peut pas effectuer dans le système. </Text>
                            <Table 
                                highlightOnHover
                                horizontalSpacing="md"
                                verticalSpacing="xs"
                                sx={{ tableLayout: 'fixed', minWidth: 700 }}
                                style={{marginTop:14}}
                            >
                                <colgroup>
                                    <col span="1" style={{width: "35%"}} />
                                    <col span="1" style={{width: "12%"}} />
                                    <col span="1" style={{width: "12%"}} />
                                    <col span="1" style={{width: "12%"}} />
                                    <col span="1" style={{width: "12%"}} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <Th>
                                            Collection des données
                                        </Th>
                                        <Th>
                                            LECTURE
                                        </Th>
                                        <Th>
                                            CREATION
                                        </Th>
                                        <Th>
                                            MODIFICATION
                                        </Th>
                                        <Th>
                                            SUPPRESSION
                                        </Th>
                                    </tr>
                                </thead>
                                <tbody>
                                {rows.length > 0 ? (
                                    rows
                                ) : (
                                    <tr style={{width: '100%'}}>
                                    <td colSpan={Object.keys(data[0]).length + 1}>
                                        <Text weight={500} align="center">
                                        Nothing found
                                        </Text>
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                            <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 14}}>
                                <Button size="sm" loading={loading} leftIcon={<FaRegSave/>}  type='submit' color='gray'>Enregistrer</Button>
                            </div>
                        </form>
                    </Card>
                </Grid.Col>
            </Grid>

    </div>
    )
}

export default PermissionSettings