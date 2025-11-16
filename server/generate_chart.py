import sys
import json
import matplotlib.pyplot as plt
import numpy as np

def generate_charts(stats):
    player_names = [player['name'] for player in stats]
    kd_ratios = [player['summaryStats']['kd'] / 100 for player in stats]
    adr_values = [player['summaryStats']['adr'] for player in stats]
    wins = [player['summaryStats']['wins'] for player in stats]
    kpr_values = [player['summaryStats']['kpr'] for player in stats]
    kills_values = [player['summaryStats']['kills'] for player in stats]

    # K/D Ratio Chart
    plt.figure(figsize=(4, 2.4))
    plt.bar(player_names, kd_ratios, color='skyblue')
    plt.ylabel('K/D Ratio')
    plt.title('K/D Ratio Comparison')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('kd_chart.png')
    plt.close()

    # ADR Chart
    plt.figure(figsize=(4, 2.4))
    plt.bar(player_names, adr_values, color='lightgreen')
    plt.ylabel('Average Damage per Round (ADR)')
    plt.title('ADR Comparison')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('adr_chart.png')
    plt.close()

    # Wins Chart
    plt.figure(figsize=(4, 2.4))
    plt.bar(player_names, wins, color='gold')
    plt.ylabel('Wins')
    plt.title('Wins Comparison')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('wins_chart.png')
    plt.close()

    # Kills per Round Chart
    plt.figure(figsize=(4, 2.4))
    plt.bar(player_names, kpr_values, color='lightcoral')
    plt.ylabel('Kills per Round (KPR)')
    plt.title('Kills per Round Comparison')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('kpr_chart.png')
    plt.close()

    # Kills Chart
    plt.figure(figsize=(4, 2.4))
    plt.bar(player_names, kills_values, color='#ff9999')
    plt.ylabel('Kills')
    plt.title('Kills Comparison')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('kills_chart.png')
    plt.close()

if __name__ == '__main__':
    # Read stats from stdin
    stats_data = json.load(sys.stdin)
    generate_charts(stats_data)
    # Print a success message to stdout, so Node.js knows it's done
    print("Charts generated successfully")
