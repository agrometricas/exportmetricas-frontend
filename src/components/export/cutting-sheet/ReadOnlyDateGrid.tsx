import { Box, Grid, GridItem, Field } from '@chakra-ui/react';
import DisplayField from './DisplayField';

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
                    <Field.Label fontSize="sm" m="0">
                        Días de corte:
                    </Field.Label>
                </GridItem>
                {weekDaysOfWeek.map((day, index) => (
                    <GridItem key={index}>
                        <DisplayField label={day} value={weekBoxesOfDay[index]?.toString() || '0'} />
                    </GridItem>
                ))}
                <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="flex-start">
                    <Field.Label fontSize="sm" m="0">
                        Total de Cajas:
                    </Field.Label>
                </GridItem>
                <GridItem>
                    <DisplayField label="" value={weekTotal.toString()} />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default ReadOnlyDateGrid;
