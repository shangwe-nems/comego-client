/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Card, Grid, Button, Modal, Title, Divider, Table, ScrollArea, TextInput, createStyles, UnstyledButton, Group, Text, Center, Avatar, ActionIcon } from '@mantine/core'
import { BsSearch, BsChevronUp, BsChevronDown, BsChevronExpand, BsReceipt, BsPrinter, BsXOctagonFill, BsFillXOctagonFill, BsX, BsCheck2, BsXOctagon, BsCart4 } from 'react-icons/bs'
import { useModals } from '@mantine/modals'
import './achats.scss'
import { LoadClients } from '../../hooks/fetchClients'
import { useDispatch } from 'react-redux'
import { useNotifications } from '@mantine/notifications'
import { useSelector } from 'react-redux'
import Loading from '../../components/Loader'
import InvoiceDisplay from '../../components/InvoiceDisplay'
import CommandeForm from '../../components/CommandeForm'
import { LoadCommandes } from '../../hooks/fetchCommandes'
import { cancelCommande } from '../../redux/slices/commandes'


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
  const Icon = sorted ? (reversed ? BsChevronUp : BsChevronDown) : BsChevronExpand;
  return (
    <th className={classes.th}>
      {children === '-' ? null :
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          {children === '' || children === 'Prix de vente' || children === 'Quantité' || children === 'Montant total' || children === 'Echéance' || children === 'Paeiment' || children === 'Actions' || children === 'Auth' ? null :
          <Center className={classes.icon}>
            <Icon size={14} /> 
          </Center>}
        </Group>
      </UnstyledButton>
      }
    </th>
  );
}

function filterData(data, search) {
  const keys = ['commande_no', 'createdAt', 'provider_name'];
  const query = search.toLowerCase().trim();
  
  return data.filter((item) => {
    return keys.some((key) => {
      return item[key]?.toString()?.toLowerCase().includes(query)
    })
  });
}

function sortData(data, payload) {
  if (!payload.sortBy) {
      return filterData(data, payload.search);
  }

  return filterData(
      [...data].sort((a, b) => {
      if (payload.reversed) {
          return b[payload.sortBy].localeCompare(a[payload.sortBy]);
      }

      return a[payload.sortBy].localeCompare(b[payload.sortBy]);
      }),
      payload.search
  );
}

function Commandes() {
  const dispatch = useDispatch()
  const notifications = useNotifications()
  const invoicesState = useSelector(state => state.commandes)

  const [isLoading, invoices] = LoadCommandes()

  const [createVisible, setcreateVisible] = useState(false)

  const [invoiceVisible, setinvoiceVisible] = useState(false)
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedInvoice, setselectedInvoice] = useState()

  const [commandeVisible, setcommandeVisible] = useState(false)


  useEffect(() => {
    setSortedData(invoicesState)
    return () => {
      setSortedData([])
    }
  }, [invoicesState, invoices])
  

  const modals = useModals();
  LoadClients()

  const openConfirmModal = (e, data) => modals.openConfirmModal({
      title: <Text size='lg' weight={400} color="red" style={{display: 'inline-flex', alignItems: 'center'}}>Annuler cette facture ?</Text>,
      children: (
      <Text size="xs">
          Etes-vous sure de vouloir annuler ce bon de commande ? Cette action est irreversible.
      </Text>
      ),
      zIndex: 201,
      labels: { confirm: 'confirmer annulation', cancel: 'annuler' },
      confirmProps: {color: 'red', size: 'xs', leftIcon: <BsXOctagonFill size={16} />},
      cancelProps : {size: 'xs'},
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        const res = await dispatch(cancelCommande(data._id))
        if(res.payload?._id) {
            notifications.showNotification({
                color: 'green',
                title: 'Success',
                message: 'Invoice cancelled successfully',
                icon: <BsCheck2 size={22} />
            })
        }   
  
        if(res.error.message !== "Forbidden") {
  
            notifications.showNotification({
                color: 'red',
                title: 'Error',
                message: 'Something happened...',
                icon: <BsX  size={22} />
            })
        }
    }
  })

  const handleSearchChange = (event) => {
      const { value } = event.currentTarget;
      setSearch(value);
      setSortedData(sortData(invoicesState, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const parseNumber = (value) => {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Here is where we design the data in the rows data
  const rows = sortedData?.slice(0).reverse().map((row) => (
      <tr key={row._id} style={{cursor: "pointer", color: row?.isValid ? null : 'GrayText', backgroundColor: row?.isValid ? null : 'rgba(255, 0, 0, .1)'}}>
          {/* Avatar */}
          <td>
              <Avatar size='sm'>
                {row?.isValid ? <BsReceipt size={16} color='teal' /> : 
                <BsXOctagon size={16} color='red' />}
              </Avatar>
          </td>
          {/* Designation */}
          <td>
              <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16}}>{new Date(row?.createdAt).toLocaleString('vh').substring(0, 17)}</h3>
          </td>
          {/* PV Min */}
          <td style={{textAlign: 'left'}}>
              <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16, color: 'GrayText'}}>{`Nº ${(row.commande_no)?.toString()?.padStart(7 + '', "0")}`}</h3>
          </td>
          {/* Prix de revient */}
          <td style={{textAlign: 'left'}}>
              <h3 style={{margin: 0, padding: 0, fontWeight:600, color:'dodgerblue', fontSize:16}}>{row.provider_name?.toUpperCase()}</h3>
          </td>
          {/* Prix de vente Gen */}
          <td style={{textAlign: 'right'}}>
              <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:18}}>${parseNumber(row.total_amount?.toFixed(3))}</h3>
          </td>
          <td style={{ width: '100%',}}>
            <span style={{display: 'inline-flex', alignItems: 'center'}}>
              <Avatar color='gray' size={28} style={{marginRight: 8}} radius='50%'>{row?.author?.first_name[0]}{row?.author?.last_name[0]}</Avatar>
              <ActionIcon color="blue" variant="light" style={{marginRight: 8}} onClick={() => {setinvoiceVisible(true); setselectedInvoice(row)}}><BsPrinter size={16} /></ActionIcon>
              {row?.isValid ? <ActionIcon color="red" variant="light" onClick={e => openConfirmModal(e, row)} ><BsFillXOctagonFill size={16} /></ActionIcon> : null}
            </span>
          </td>
      </tr>
  ));

  return (
    <div style={{width: "100%"}}>
        <Grid gutter='sm' style={{marginBottom:7}}>
          <Grid.Col span={12}>
            <Card>
              <div>
                  <ScrollArea>
                      <div style={{width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between'}}>
                          <div>
                            <Button leftIcon={<BsCart4 size={20} />} onClick={() => setcommandeVisible(true)} color="teal" >Passer commande</Button>
                          </div>
                          <TextInput placeholder="Search by any field" value={search} onChange={handleSearchChange} variant="filled" style={{width: 280}} icon={<BsSearch size={14} />} />
                      </div>
                      <Divider style={{marginBlock:14}} />
                      <Table 
                          highlightOnHover
                          horizontalSpacing="md"
                          verticalSpacing="xs"
                          sx={{ tableLayout: 'fixed', minWidth: 700 }}
                      >
                          <colgroup>
                              <col span="1" style={{width: "2.8%"}} />
                              <col span="1" style={{width: "9%"}} />
                              <col span="1" style={{width: "8%"}} />
                              <col span="1" style={{width: "28%"}} />
                              <col span="1" style={{width: "8%"}} />
                              <col span="1" style={{width: "7%"}} />
                          </colgroup>
                          <thead>
                              <tr>
                                  <Th>
                                    -
                                  </Th>
                                  <Th>
                                      Date
                                  </Th>
                                  <Th>
                                      Nº facture
                                  </Th>
                                  <Th>
                                      Nom du fournisseur
                                  </Th>
                                
                                  <Th>
                                      Montant total
                                  </Th>
                                  <Th>
                                      Actions
                                  </Th>
                              </tr>
                          </thead>
                          {isLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan={6} style={{height: 120}}>
                                        <Loading />
                                    </td>
                                </tr>
                            </tbody>) : (<tbody>
                            {rows?.length > 0 ? (
                                rows
                            ) : (
                                <tr >
                                    <td colSpan={6}>
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
            size={550}
            opened={commandeVisible}
            onClose={() => setcommandeVisible(false)}
            title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><BsCart4 size={18} style={{marginRight:8}} /> Nouvelle commande</Title>}
        >
            <CommandeForm
                status='create' 
                handleClose={() => {
                    setcommandeVisible(false)
                    setselectedInvoice(undefined)
                }} 
            />
        </Modal>

        <Modal
            overlayOpacity={0.5}
            size={900}
            opened={invoiceVisible}
            onClose={() => setinvoiceVisible(false)}
            title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'400', color:'#fa5252'}}><BsReceipt size={18} style={{marginRight:8}} /> Bon de commande Nº {(selectedInvoice?.commande_no)?.toString()?.padStart(7 + '', "0")}</Title>}
        >
          <InvoiceDisplay
            category="commande"
            data={selectedInvoice}
            handleClose={() => {
              setcreateVisible(false)
            }}
          />
        </Modal>
    </div>
  )
}

export default Commandes