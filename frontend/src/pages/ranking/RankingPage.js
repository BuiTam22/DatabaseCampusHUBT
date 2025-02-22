import React, { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Paper,
    Avatar,
    Chip,
    LinearProgress,
    Tabs,
    Tab,
    Grid,
    Typography,
    Box,
    useMediaQuery,
    useTheme,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ApiService from '../../services/apiService';

// Styled components
const RankingWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(3),
    '& .MuiPaper-root': {
        marginTop: theme.spacing(2)
    }
}));

const StyledTableRow = styled(TableRow)(({ rank }) => ({
    backgroundColor: rank === 1 ? '#ffd70026' :
                    rank === 2 ? '#c0c0c026' :
                    rank === 3 ? '#cd853f26' : 'inherit',
    transition: 'background-color 0.2s',
    '&:hover': {
        backgroundColor: rank === 1 ? '#ffd70040' :
                        rank === 2 ? '#c0c0c040' :
                        rank === 3 ? '#cd853f40' : 
                        '#f5f5f5'
    }
}));

const RankingPage = () => {
    const [exerciseTab, setExerciseTab] = useState(0);
    const [contestTab, setContestTab] = useState(0);
    const [exerciseRankings, setExerciseRankings] = useState([]);
    const [contestRankings, setContestRankings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const [exerciseData, contestData] = await Promise.all([
                    ApiService.fetch('/api/rankings/exercise'),
                    ApiService.fetch('/api/rankings/contest')
                ]);
                setExerciseRankings(exerciseData);
                setContestRankings(contestData);
            } catch (error) {
                console.error('Error fetching rankings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRankings();
    }, []);

    const getRankColor = (rank) => {
        const colors = {
            'Master': '#FF4D4D',
            'Diamond': '#B9F2FF',
            'Platinum': '#E5E4E2',
            'Gold': '#FFD700',
            'Silver': '#C0C0C0',
            'Bronze': '#CD853F'
        };
        return colors[rank] || '#grey';
    };

    const RankingTable = ({ data, type }) => (
        <TableContainer component={Paper} elevation={3}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width="10%">Rank</TableCell>
                        <TableCell width="40%">User</TableCell>
                        {type === 'exercise' ? (
                            <>
                                <TableCell width="20%">Solved</TableCell>
                                <TableCell width="20%">Accuracy</TableCell>
                            </>
                        ) : (
                            <>
                                <TableCell width="20%">Points</TableCell>
                                <TableCell width="20%">Wins</TableCell>
                            </>
                        )}
                        <TableCell width="10%">Tier</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((user, index) => (
                        <StyledTableRow key={user.id} rank={index + 1}>
                            <TableCell>
                                <Typography 
                                    variant="h6" 
                                    color={index < 3 ? 'primary' : 'textSecondary'}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    #{index + 1}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Avatar 
                                        src={user.avatar}
                                        sx={{ 
                                            width: 40, 
                                            height: 40,
                                            border: index < 3 ? '2px solid #FFD700' : 'none'
                                        }}
                                    >
                                        {user.name[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1">{user.name}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            @{user.username}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            {type === 'exercise' ? (
                                <>
                                    <TableCell>
                                        <Typography variant="body1">{user.solved}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={user.accuracy} 
                                                sx={{ 
                                                    width: 100,
                                                    height: 8,
                                                    borderRadius: 5
                                                }}
                                            />
                                            <Typography variant="body2">
                                                {user.accuracy}%
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>
                                        <Typography variant="body1" color="primary">
                                            {user.points}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1">
                                            {user.wins}
                                        </Typography>
                                    </TableCell>
                                </>
                            )}
                            <TableCell>
                                <Chip 
                                    label={user.tier}
                                    sx={{ 
                                        backgroundColor: getRankColor(user.tier),
                                        fontWeight: 'bold',
                                        color: user.tier === 'Master' ? 'white' : 'inherit'
                                    }}
                                />
                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <RankingWrapper>
            <Typography variant="h4" gutterBottom>Rankings</Typography>
            <Grid container spacing={3} direction={isMobile ? 'column' : 'row'}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                            <Tabs 
                                value={exerciseTab} 
                                onChange={(e, v) => setExerciseTab(v)}
                                variant="fullWidth"
                            >
                                <Tab label="All Time" />
                                <Tab label="Monthly" />
                                <Tab label="Weekly" />
                            </Tabs>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Exercise Rankings</Typography>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <RankingTable data={exerciseRankings} type="exercise" />
                            )}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                            <Tabs 
                                value={contestTab} 
                                onChange={(e, v) => setContestTab(v)}
                                variant="fullWidth"
                            >
                                <Tab label="All Time" />
                                <Tab label="Monthly" />
                                <Tab label="Weekly" />
                            </Tabs>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Contest Rankings</Typography>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <RankingTable data={contestRankings} type="contest" />
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </RankingWrapper>
    );
};

export default RankingPage;