import { Box, Grid, GridItem } from '@chakra-ui/react';
import DisplayField from './DisplayField';
import { FormLabel } from '../../ui/form/FormLabel';

interface ReadOnlyDateGridProps {
    weekDaysOfWeek: string[];
    weekBoxesOfDay: number[];
    weekTotal: number;
}

const ReadOnlyDateGrid: React.FC<ReadOnlyDateGridProps> = ({
    weekDaysOfWeek,
    weekBoxesOfDay,
    weekTotal,
}) => {
    return (
        <Box py={4}>
            <Grid templateRows="repeat(2, auto)" templateColumns="repeat(8, 1fr)" gap={2}>
                <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="flex-start">
                    <FormLabel fontSize="sm" m="0">
                        Días de corte:
                    </FormLabel>
                </GridItem>
                {weekDaysOfWeek.map((day, index) => (
                    <GridItem key={index}>
                        <DisplayField label={day} value={weekBoxesOfDay[index]?.toString() || '0'} />
                    </GridItem>
                ))}
                <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="flex-start">
                    <FormLabel fontSize="sm" m="0">
                        Total de cajas:
                    </FormLabel>
                </GridItem>
                <GridItem>
                    <DisplayField label="" value={weekTotal.toString()} />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default ReadOnlyDateGrid;
