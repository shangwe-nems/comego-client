
import React, { useEffect, useState } from 'react'
import { Avatar, Badge, Button, Center, createStyles, Divider, Group, Modal, ScrollArea, Table, Text, TextInput, Title, UnstyledButton } from '@mantine/core'
import { BsChevronUp, BsChevronDown, BsChevronExpand, BsCashStack, BsSearch, BsBank2, BsArrowReturnRight } from "react-icons/bs";
import BankForm from '../BankForm';
import { useSelector } from 'react-redux';
import { LoadBanks } from '../../hooks/fetchBank';
import Loading from '../Loader';


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
  }
}));

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? BsChevronUp : BsChevronDown) : BsChevronExpand;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={600} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            {children === 'Description' || children === 'Actions' ? null : <Icon size={14} /> }
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}


function filterData(data, search) {
  const keys = ['designation', 'motive'];
  const query = search.toLowerCase().trim();
  return data.filter((item) => keys.some((key) => item[key].toLowerCase().includes(query)));
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

const parseNumber = (value) => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function BankingDisplay() {
    const bankState = useSelector(state => state.banks)
    const [isloading, banks] = LoadBanks()

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const [editIncomeVisible, setEditIncomeVisible] = useState(false);
    const [incomeVisible, setIncomeVisible] = useState(false);
    const [selectedData, setSelectedData] = useState()

    useEffect(() => {
      setSortedData(bankState)
      return () => {
        setSortedData([])
      }
    }, [bankState, banks])

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(bankState, { sortBy: field, reversed, search }));
      };
    
    const handleSearchChange = (event) => {
      const { value } = event.currentTarget;
      setSearch(value);
      setSortedData(sortData(bankState, { sortBy, reversed: reverseSortDirection, search: value }));
    };
    
    const rows = sortedData?.slice(0).reverse().map((row) => (
      <tr key={row._id} style={{cursor: 'pointer'}}>
        <td>
          <div style={{display: 'inline-flex', alignItems: 'center', color: 'GrayText'}}>
              <BsBank2 size={24} />
              <div style={{marginLeft:14}}>
                <p style={{fontSize: 14, marginBottom:-2}}>{new Date(row?.createdAt).toLocaleString('vh')?.substring(0, 17)}</p>
                {row?.category === 'withdraw' ?
                  <Badge size='xs' radius='sm' variant='light' color='red'>Rétrait</Badge> :
                  <Badge size='xs' radius='sm' variant='light' color='green'>Dépot</Badge>
                }
              </div>
          </div>
        </td>
        <td>
          <h4 style={{textOverflow: 'ellipsis', overflow: 'hidden', textAlign:"right", fontSize: 16}}>{row.code}</h4>
        </td>
        <td>
          <h4 style={{margin: 0, padding: 0, fontSize:14, marginBottom: -2}}>{row.designation}</h4>
          <p style={{textOverflow: 'ellipsis', color: 'GrayText', overflow: 'hidden', fontSize: 12}}><BsArrowReturnRight /> {row?.motive}</p>
        </td>
        <td>
          <h4 style={{textOverflow: 'ellipsis', color: row?.category === 'withdraw' ? 'red' : 'green',  overflow: 'hidden', textAlign:"right", fontSize: 18}}>${parseNumber(row.amount?.toFixed(3))}</h4>
        </td>
        <td style={{textAlign: 'left'}}>
          <h4 style={{textOverflow: 'ellipsis', overflow: 'hidden', textAlign:"right", fontSize: 18}}>${parseNumber(row.balance?.toFixed(3))}</h4>
        </td>
        <td style={{ width: '100%',}}>
          <span style={{display: 'inline-flex', alignItems: 'center'}}>
            <Button color="green" size="xs" variant="light" style={{marginRight: 8}} onClick={() => {setEditIncomeVisible(true); setSelectedData(row)}}>Modifier</Button>
            <Avatar color='gray' size={32} radius='50%'>{row?.author?.first_name[0]}{row?.author?.last_name[0]}</Avatar>
            {/* <ActionIcon color="red" variant="light" onClick={openConfirmModal} ><BsTrash size={16} /></ActionIcon> */}
          </span>
        </td>
      </tr>
  ));

  return (
    <div style={{padding: "7px 0"}}>
        <ScrollArea>
          <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom:-14}}>
            <Button leftIcon={<BsBank2 size={18} />} color='red' mb="md" onClick={() => setIncomeVisible(true)}>Ajouter transaction bancaire</Button>
            <div style={{display:'inline-flex', alignItems:'center'}}>
              <TextInput
                placeholder="Rechercher..."
                variant="filled" 
                mb="md"
                icon={<BsSearch size={14} />}
                value={search}
                onChange={handleSearchChange}
                style={{width: 280}}
              />
              {/* <DateRangePicker 
                variant="filled" 
                mb="md"
                placeholder='Filtrer resultats par date'
                style={{marginLeft:14, paddingRight:8, minWidth: 320}}
                rightSection={
                  <ActionIcon variant="filled" color='green'>
                    <BsArrowRight />
                  </ActionIcon>
                }
              /> */}
            </div>
            
          </div>
          <Divider style={{marginBlock:14}} />
          <Table
            highlightOnHover
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ tableLayout: 'fixed', minWidth: 700 }}
          >
            <colgroup>
              <col span="1" style={{width: "16%"}} />
              <col span="1" style={{width: "8%"}} />
              <col span="1" style={{width: "33%"}} />
              <col span="1" style={{width: "14%"}} />
              <col span="1" style={{width: "12%"}} />
              <col span="1" style={{width: "11%"}} />
            </colgroup>
            <thead>
              <tr>
                <Th
                  sorted={sortBy === 'createdAt'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('createdAt')}
                >
                  Date & time
                </Th>
                <Th
                  sorted={sortBy === 'code'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('code')}
                >
                  Code
                </Th>
                <Th>
                  Libellé 
                </Th>
                <Th
                  sorted={sortBy === 'amount'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('amount')}
                >
                  Montant
                </Th>
                <Th>
                  Solde
                </Th>
                <Th>
                  Actions
                </Th>
              </tr>
            </thead>
            {isloading ? (
              <tbody>
                  <tr>
                      <td colSpan={6} style={{height: 120}}>
                          <Loading />
                      </td>
                  </tr>
              </tbody>) : (<tbody>
              {rows.length > 0 ? (
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
        <Modal
          opened={editIncomeVisible}
          onClose={() => setEditIncomeVisible(false)}
          title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color: '#fa5252'}} ><BsCashStack size={20} style={{marginRight:8}} /> Modifer transaction bancaire</Title>}
        >
          <BankForm 
            status='edit' 
            data={selectedData}
            handleClose={() => {
                setEditIncomeVisible(false)
                setSelectedData(undefined)
            }}
          />
        </Modal>

        <Modal
          opened={incomeVisible}
          onClose={() => setIncomeVisible(false)}
          // size={640}
          title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color: '#fa5252'}} ><BsCashStack size={20} style={{marginRight:8}} /> Nouvelle transaction bancaire</Title>}
        >
          <BankForm 
            status='create' 
            handleClose={() => {
                setIncomeVisible(false)
                setSelectedData(undefined)
            }}
          />
        </Modal>
    </div>
  )
}

export default BankingDisplay