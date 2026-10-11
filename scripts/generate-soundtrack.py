"""Génère la narration audio complète et le fond sonore ambiant pour la vidéo TSA (42 s).
Utilise la voix française Microsoft Paul (OneCore) et un synthétiseur d'ambiance numpy.
Mixage finalisé à 48 kHz stéréo avec normalisation broadcast.
"""
import math
import os
import subprocess
import wave
import numpy as np
import win32com.client

SR = 48000
TOTAL_DURATION = 42.0
TOTAL_SAMPLES = int(TOTAL_DURATION * SR)

# 1. Narration Cues (début, texte français)
CUES = [
    (0.5, "TSA : analyse et calcul de structures."),
    (4.5, "Modélisation 3D complète : poteaux, poutres, dalles, voiles, semelles et escaliers."),
    (11.5, "Matériaux et rendu réaliste : béton coffré, acier peint ou galvanisé, modes texturé et filaire."),
    (17.5, "Structures avancées : pont à haubans de trois cent quarante mètres, pylônes en H et tablier métallique."),
    (24.5, "Calcul réel avec OpenSees : déformée amplifiée, contraintes normales et efforts dans les haubans."),
    (32.5, "Édition de notes de calcul simplifiée et détaillée en PDF, à partir des résultats réels."),
    (38.2, "Modéliser, calculer, justifier. Avec TSA.")
]

def synthesize_voice_segments(temp_dir):
    os.makedirs(temp_dir, exist_ok=True)
    cat = win32com.client.Dispatch("SAPI.SpObjectTokenCategory")
    cat.SetId(r"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech_OneCore\Voices", False)
    tokens = cat.EnumerateTokens()
    
    # Préférer Paul (voix masculine posée et claire), repli sur Julie ou Hortense
    selected_voice = None
    for target in ["Paul", "Julie", "Hortense"]:
        for i in range(tokens.Count):
            desc = tokens.Item(i).GetDescription()
            if target in desc and "French" in desc:
                selected_voice = tokens.Item(i)
                print(f"Voix sélectionnée : {desc}")
                break
        if selected_voice:
            break
            
    if not selected_voice:
        raise RuntimeError("Aucune voix française trouvée dans Speech_OneCore")

    voice_wavs = []
    sp = win32com.client.Dispatch("SAPI.SpVoice")
    sp.Voice = selected_voice
    sp.Rate = 0  # vitesse normale naturelle
    sp.Volume = 100

    for idx, (start_t, text) in enumerate(CUES):
        out_wav = os.path.join(temp_dir, f"voice_{idx}.wav")
        fs = win32com.client.Dispatch("SAPI.SpFileStream")
        fs.Open(out_wav, 3, False)
        sp.AudioOutputStream = fs
        sp.Speak(text)
        fs.Close()
        voice_wavs.append((start_t, out_wav))
        
    return voice_wavs

def load_and_resample(wav_path):
    with wave.open(wav_path, 'rb') as wf:
        n_ch = wf.getnchannels()
        sw = wf.getsampwidth()
        orig_sr = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)
        
    if sw == 2:
        data = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    else:
        raise ValueError("Unsupported sample width")
        
    if n_ch == 2:
        data = data.reshape(-1, 2).mean(axis=1)
        
    if orig_sr != SR:
        # Rééchantillonnage de haute qualité
        target_len = int(len(data) * SR / orig_sr)
        x_orig = np.linspace(0, len(data), len(data), endpoint=False)
        x_new = np.linspace(0, len(data), target_len, endpoint=False)
        data = np.interp(x_new, x_orig, data)
        
    return data

def build_ambient_track():
    """Génère un tapis sonore instrumental (pad ambient doux et moderne) en 48 kHz stéréo."""
    t = np.linspace(0, TOTAL_DURATION, TOTAL_SAMPLES, endpoint=False)
    
    # Progression d'accords doux : Fmaj9 (0-11s), Bbmaj7 (11-24s), Dm9 (24-35s), Csus4 -> F (35-42s)
    chords = [
        # (t_start, t_end, [notes en Hz])
        (0.0, 11.0, [87.31, 130.81, 174.61, 220.00, 261.63, 329.63]),     # F2, C3, F3, A3, C4, E4
        (11.0, 24.0, [116.54, 146.83, 174.61, 233.08, 293.66, 349.23]),   # Bb2, D3, F3, Bb3, D4, F4
        (24.0, 35.0, [73.42, 110.00, 146.83, 220.00, 261.63, 329.63]),    # D2, A2, D3, A3, C4, E4
        (35.0, 42.0, [87.31, 130.81, 174.61, 220.00, 261.63, 349.23]),    # F2, C3, F3, A3, C4, F4
    ]
    
    left = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    right = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    for t_s, t_e, freqs in chords:
        i_s = int(t_s * SR)
        i_e = min(int(t_e * SR), TOTAL_SAMPLES)
        dur = (i_e - i_s) / SR
        tt = np.linspace(0, dur, i_e - i_s, endpoint=False)
        
        # Enveloppe douce avec crossfade de 1.8 seconde
        fade_in = np.clip(tt / 1.8, 0, 1)
        fade_out = np.clip((dur - tt) / 1.8, 0, 1)
        env = 0.5 - 0.5 * np.cos(np.pi * np.minimum(fade_in, fade_out))
        
        sig_l = np.zeros_like(tt)
        sig_r = np.zeros_like(tt)
        
        for k, f0 in enumerate(freqs):
            weight = 1.0 / (1.0 + 0.3 * k)
            # harmoniques douces avec léger detune stéréo
            phase_l = np.random.uniform(0, 2*np.pi)
            phase_r = phase_l + 0.3
            sig_l += weight * (np.sin(2 * np.pi * f0 * tt + phase_l) + 0.25 * np.sin(4 * np.pi * f0 * tt))
            sig_r += weight * (np.sin(2 * np.pi * (f0 * 1.002) * tt + phase_r) + 0.25 * np.sin(4 * np.pi * (f0 * 1.002) * tt))
            
        left[i_s:i_e] += sig_l * env * 0.08
        right[i_s:i_e] += sig_r * env * 0.08
        
    # Fondu global d'entrée (1.5 s) et de fin (2.5 s)
    master_fade = np.minimum(np.clip(t / 1.5, 0, 1), np.clip((TOTAL_DURATION - t) / 2.5, 0, 1))
    left *= master_fade
    right *= master_fade
    
    return left, right

def create_soundtrack(output_wav):
    temp_dir = os.path.join(os.path.dirname(output_wav), "audio_temp")
    voice_cues = synthesize_voice_segments(temp_dir)
    
    voice_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    voice_activity = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    for start_t, v_path in voice_cues:
        samples = load_and_resample(v_path)
        i_start = int(start_t * SR)
        i_end = min(i_start + len(samples), TOTAL_SAMPLES)
        length = i_end - i_start
        voice_track[i_start:i_end] += samples[:length]
        
        # Enveloppe d'activité pour le ducking (avec padding de 0.4s avant et après)
        d_start = max(0, int((start_t - 0.3) * SR))
        d_end = min(TOTAL_SAMPLES, int((start_t + len(samples)/SR + 0.5) * SR))
        voice_activity[d_start:d_end] = 1.0
        
    # Lisser l'activité pour un ducking naturel
    kernel_size = int(0.4 * SR)
    smooth_act = np.convolve(voice_activity, np.hanning(kernel_size) / np.sum(np.hanning(kernel_size)), mode='same')
    smooth_act = np.clip(smooth_act, 0.0, 1.0)
    
    # ducking : la musique est à -14 dB (0.2) en présence de voix, et monte à 0.65 dans les respirations
    duck_gain = 0.65 * (1.0 - 0.70 * smooth_act)
    
    music_l, music_r = build_ambient_track()
    music_l *= duck_gain
    music_r *= duck_gain
    
    # Mixage stéréo (voix centrée et claire avec légère présence)
    # Rehaussement léger de la voix
    voice_max = np.max(np.abs(voice_track))
    if voice_max > 0:
        voice_track = (voice_track / voice_max) * 0.85
        
    mix_l = voice_track + music_l
    mix_r = voice_track + music_r
    
    # Normalisation propre (-1 dBFS peak pour éviter tout écrêtage)
    peak = max(np.max(np.abs(mix_l)), np.max(np.abs(mix_r)))
    if peak > 0:
        target_peak = 0.89  # ~ -1 dBFS
        mix_l = (mix_l / peak) * target_peak
        mix_r = (mix_r / peak) * target_peak
        
    int_l = np.clip(mix_l * 32767, -32768, 32767).astype(np.int16)
    int_r = np.clip(mix_r * 32767, -32768, 32767).astype(np.int16)
    
    stereo_interleaved = np.empty((TOTAL_SAMPLES * 2,), dtype=np.int16)
    stereo_interleaved[0::2] = int_l
    stereo_interleaved[1::2] = int_r
    
    with wave.open(output_wav, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(stereo_interleaved.tobytes())
        
    print(f"Bande sonore générée avec succès : {output_wav} ({TOTAL_DURATION} s, 48 kHz stéréo)")

if __name__ == "__main__":
    out = os.path.abspath("public/video/tsa-soundtrack.wav")
    create_soundtrack(out)
