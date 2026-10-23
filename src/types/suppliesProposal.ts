export interface SuppliesProposal {
  containers: number;
  supplies: { [quantity: `${string}Quantity`]: number } & {
    pesticideSent: { pesticideId: number; quantity: number }[];
    insecticideSent: { insecticideId: number; quantity: number }[];
    stickerSent: { stickerId: number; quantity: number }[];
    sheetSent: { sheetId: number; quantity: number }[];
  };
}

export interface FumigationProposal {
  pesticideId: number;
  dose: number;
  quantity: number;
}
