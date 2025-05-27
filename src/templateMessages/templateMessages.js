const getWelcomeMessageTemplate = (userName) => {
  return (
    `*Oi, ${userName}! Eu sou a Lina!* 😊💙\n` +
    'Seja bem-vindo(a)! Estou aqui para te ajudar a acompanhar o seu diabetes de um jeito simples e sem complicação. Basta me mandar mensagens no WhatsApp – pode ser texto ou áudio, que eu entendo e organizo tudo pra você!\n\n' +
    '*Aqui está como posso te ajudar*:\n' +
    '✅ *Acompanhar seu dia a dia*: Me conte o que comeu, suas medições de glicose e doses de insulina. Eu registro tudo direitinho!\n' +
    '✅ *Gerar relatórios automáticos*: Com base no que você me contar, eu resumo suas informações para te ajudar no controle.\n' +
    '✅ *Explicar sobre diabetes*: Tem dúvidas? Pergunte! Eu te ajudo com informações claras e confiáveis.\n' +
    '✅ *Monitorar sintomas*: Se sentir algo diferente, me avise! Assim, posso acompanhar sua saúde de perto.\n\n' +
    'É só falar comigo como se estivesse conversando com um amigo. Vamos juntos tornar seu dia a dia mais tranquilo! 💙😊'
  );
};

module.exports = { getWelcomeMessageTemplate };
