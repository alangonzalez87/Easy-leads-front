alter table public.leads
  add column if not exists fecha_finalizacion_chatgpt date,
  add column if not exists notas text;
