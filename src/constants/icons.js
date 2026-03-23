import {
  MessageCircle, CheckSquare, Users, BarChart, Zap, TrendingUp,
  Compass, Palette, RefreshCw, RotateCcw, ChevronLeft, PartyPopper,
  Shuffle, UserPlus, Timer, Play, Plus, Trash2, Save, X,
  Star, Heart, Lightbulb, Target, Trophy,
  Brain, Rocket, Flag, Gem, Ghost, Gift, Glasses, Hammer, Key, Laptop,
  Leaf, Lock, Map, Moon, Music, Pen, Phone, PieChart, Shield, Smile, Sun,
  Wrench, Umbrella, Video, Coffee, Beer, Pizza, Briefcase, Camera, Cloud,
  Sparkles
} from 'lucide-react';

export const iconMap = {
  MessageCircle, CheckSquare, Users, BarChart, Zap, TrendingUp, Compass, Palette, RefreshCw,
  Star, Heart, Lightbulb, Target, Trophy, Brain, Rocket, Flag, Gem, Ghost, Gift,
  Glasses, Hammer, Key, Laptop, Leaf, Lock, Map, Moon, Music, Pen, Phone,
  PieChart, Shield, Smile, Sun, Wrench, Umbrella, Video, Coffee, Beer, Pizza,
  Briefcase, Camera, Cloud, Sparkles, RotateCcw, ChevronLeft, PartyPopper,
  Shuffle, UserPlus, Timer, Play, Plus, Trash2, Save, X
};

export const getIconByName = (name) => iconMap[name] || MessageCircle;
