import { Link, Outlet } from 'react-router-dom'

import React, { useState } from 'react'
import { createStyles, Navbar, Group, Code } from '@mantine/core'

import { BsColumnsGap, BsPeople, BsCartCheck, BsCashCoin, BsFileEarmark, BsGear, BsFillJournalBookmarkFill, BsArrowBarLeft, BsCashStack, BsTruck } from 'react-icons/bs'
import './sidebar.scss'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/sessions'
import { IoPlanetOutline } from 'react-icons/io5'
import { LoadStocks } from '../../hooks/fetchStocks'
import { LoadTravels } from '../../hooks/fetchTravels'
import { LoadProviders } from '../../hooks/fetchProviders'
import { LoadClients } from '../../hooks/fetchClients'
import { LoadTreasuries } from '../../hooks/fetchTreasury'

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
        navbar: {
            backgroundColor: theme.colors.red[6],
            padding: '16px'
        },
    
        version: {
            backgroundColor: theme.colors.red[7],
            color: theme.white,
            fontWeight: 700,
        },
    
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colors.red[7]}`,
        },
    
        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.red[7]}`,
        },
    
        link: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color: theme.white,
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 600,
        
            '&:hover': {
                backgroundColor: theme.colors.red[5],
            },
        },
    
        linkIcon: {
            ref: icon,
            color: theme.white,
            opacity: 1,
            marginRight: theme.spacing.sm,
        },
    
        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.colors.red[7],
                [`& .${icon}`]: {
                opacity: 0.9,
                },
            },
        },
    }
})

const data = [
    { link: '/auth/dashboard', label: 'Acceuil', icon: BsColumnsGap},
    { link: '/auth/achats', label: 'Approvisionnements', icon: BsCashCoin},
    { link: '/auth/inventory', label: 'Stock', icon: BsFillJournalBookmarkFill},
    { link: '/auth/sales', label: 'Ventes', icon: BsCartCheck},
    { link: '/auth/finances', label: 'Finances', icon: BsCashStack},
    { link: '/auth/clients', label: 'Clientèle', icon: BsPeople},
    { link: '/auth/travels', label: 'Voyages', icon: IoPlanetOutline},
    { link: '/auth/providers', label: 'Fournisseurs', icon: BsTruck},
    { link: '/auth/reports', label: 'Résultats', icon: BsFileEarmark },
    { link: '/auth/settings', label: 'Paramètres', icon: BsGear },
]

function SideBar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    LoadStocks()
    LoadProviders()
    LoadTravels()
    LoadClients()
    LoadTreasuries()

    const { classes, cx } = useStyles();
    const [active, setActive] = useState('Acceuil');

    const handleLogout = (event) => {
        event.preventDefault()
        dispatch(logout())
        sessionStorage.clear()
        navigate('/login', { replace: true })
    }

    const links = data.map((item) => (
        <Link
            to={item.link}
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                navigate(item.link)
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} size={20} />
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <Navbar fixed position={{ top: 0, left: 0 }} height="100%" width={{ sm: 300 }} className={classes.navbar} >
            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    {/* <MantineLogo variant="white" /> */}
                    <span style={{display: 'inline-flex', alignItems:'center'}}>
                        <img src='./full-white.svg' height={60} width="auto" alt='logo' />
                        <h3 style={{marginLeft: 4, fontSize:20, color: '#fff', fontFamily:'sans-serif' }}>COMEGO</h3>
                    </span>
                    <Code className={classes.version}>v1.0.0</Code>
                </Group>
                {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                {/* <Link to="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <BsArrowLeftRight className={classes.linkIcon} size={20} />
                    <span>Changer de compte</span>
                </Link> */}

                <Link to="#" className={classes.link} onClick={(event) => handleLogout(event)}>
                    <BsArrowBarLeft className={classes.linkIcon} size={20} />
                    <span>Se déconnecter</span>
                </Link>
            </Navbar.Section>
            <Outlet />
        </Navbar>
    )
}

export default  SideBar

