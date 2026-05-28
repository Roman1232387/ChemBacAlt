export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mayFail = (chance = 0.03) => {
  if (Math.random() < chance) {
    throw new Error('Eroare 500: Serviciul nu raspunde.');
  }
};

export const hashPassword = (password: string): string => {
  // simulare hash simplu (nu e sigur, e doar pentru mock local)
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (h << 5) - h + password.charCodeAt(i);
    h |= 0;
  }
  return `hash_${Math.abs(h)}`;
};
