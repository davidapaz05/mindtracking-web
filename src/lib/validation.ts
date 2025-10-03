export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;
export function isAsciiOnly(value: string): boolean {
  return /^[\x00-\x7F]*$/.test(value);
}

export function validateEmail(valueRaw: string): string | null {
  const value = valueRaw.trim();

  // Verificações básicas
  if (!value) return "E-mail é obrigatório";
  if (!isAsciiOnly(valueRaw)) return "Caracteres inválidos: apenas ASCII (sem emoji)";
  if (/[\s]/.test(valueRaw)) return "E-mail não pode conter espaços";
  if (value.length > 254) return "E-mail muito longo";

  // Verifica quantidade de '@'
  const atCount = (value.match(/@/g) || []).length;
  if (atCount !== 1) return "E-mail deve conter exatamente um '@'";

  const [local, domain] = value.split("@");
  if (!local || !domain) return "Formato de e-mail inválido";

  // Regras da parte local
  if (local.length > 64) return "Parte local do e-mail é muito longa";
  if (!/^[A-Za-z0-9._%+-]+$/.test(local)) return "Caracteres inválidos na parte local";
  if (local.startsWith(".") || local.endsWith(".")) return "Parte local não pode iniciar/terminar com ponto";
  if (local.includes("..")) return "Parte local não pode conter '..'";

  // Regras do domínio
  if (domain.length > 255) return "Domínio do e-mail é muito longo";
  if (!/^[A-Za-z0-9.-]+$/.test(domain)) return "Caracteres inválidos no domínio";
  if (!domain.includes(".")) return "Domínio deve conter ponto";
  if (domain.includes("..")) return "Domínio não pode conter '..' ou mais de um ponto";

  const labels = domain.split(".");
  if (labels.some((l) => l.length === 0)) return "Domínio inválido";
  for (const label of labels) {
    if (label.length < 1 || label.length > 63) return "Cada rótulo do domínio deve ter 1–63 caracteres";
    if (!/^[A-Za-z0-9-]+$/.test(label)) return "Domínio possui caracteres inválidos";
    if (label.startsWith("-") || label.endsWith("-")) return "Rótulos do domínio não podem iniciar/terminar com '-'";
  }

  const tld = labels[labels.length - 1];
  if (!/^[A-Za-z]{2,63}$/.test(tld)) return "TLD inválido (apenas letras, 2–63)";

  // Lista de domínios permitidos (em minúsculas)
  const allowedDomains = new Set([
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com.br",
    "terra.com.br",
    "uol.com.br",
  ]);

  if (!allowedDomains.has(domain.toLowerCase())) {
    return "Este não é um domínio permitido";
  }

  // Se passou por todas as validações, retorna null
  return null;
}

export function validatePassword(password: string, confirm: string): string | null {
  if (!password || !confirm) return "Preencha todos os campos";
  if (!isAsciiOnly(password)) return "A senha não pode conter emoji";
  if (password.length < 8) return "A senha deve ter no mínimo 8 caracteres";
  if (password.length > 20) return "A senha deve ter no máximo 20 caracteres";
  if (!passwordRegex.test(password))
    return "A senha deve incluir letra maiúscula, minúscula, número e caractere especial";
  if (password !== confirm) return "As senhas não coincidem";
  return null;
}

// validation.ts - Adicione estas funções

export function validateBirthdate(birthdate: string): string | null {
  const trimmed = birthdate.trim();
  if (!trimmed) return "Data de nascimento é obrigatória";
  
  // Verificar formato DD/MM/AAAA
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    return "Formato inválido. Use DD/MM/AAAA";
  }
  
  const [day, month, year] = trimmed.split('/').map(Number);
  
  // Validar data real
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return "Data de nascimento inválida";
  }
  
  // Calcular idade
  const today = new Date();
  let age = today.getFullYear() - year;
  
  // Ajustar idade se ainda não fez aniversário este ano
  if (today.getMonth() < month - 1 || 
      (today.getMonth() === month - 1 && today.getDate() < day)) {
    age--;
  }
  
  // Validar faixa etária (12-70 anos)
  if (age < 12) return "Você deve ter pelo menos 12 anos";
  if (age > 70) return "Idade máxima permitida é 70 anos";
  
  return null;
}

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return "Telefone é obrigatório";
  
  // Remover formatação para validar
  const cleanPhone = trimmed.replace(/\D/g, '');
  
  // Validar se é celular (9 dígitos) ou fixo (8 dígitos) com DDD
  if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
    return "Telefone deve ter 10 ou 11 dígitos (com DDD)";
  }
  
  // Validar DDD (11 a 99)
  const ddd = parseInt(cleanPhone.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return "DDD inválido";
  }
  
  return null;
}

export function validateGender(gender: string): string | null {
  if (!gender) return "Gênero é obrigatório";
  
  const validGenders = ["masculino", "feminino", "outro", "prefiro não dizer"];
  if (!validGenders.includes(gender.toLowerCase())) {
    return "Selecione um gênero válido";
  }
  
  return null;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Nome é obrigatório";
  if (!isAsciiOnly(name)) return "O nome não pode conter emoji";
  if (trimmed.length < 2) return "Nome muito curto (mínimo 2 caracteres)";
  if (trimmed.length > 150) return "Nome muito longo (máximo 150 caracteres)";
  if (/[0-9]/.test(trimmed)) return "O nome não pode conter números";
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(trimmed)) return "Nome contém caracteres inválidos";
  return null;
}